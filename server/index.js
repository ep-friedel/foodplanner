#!/usr/bin/env node

const   express             = require('express')
    ,   app                 = express()
    ,   bodyparser          = require('body-parser')
    ,   compression         = require('compression')
    ,   xssFilter           = require('x-xss-protection')
    ,   https               = require('https')
    ,   fs                  = require('fs')
    ,   routes              = require(process.env.FOOD_HOME + 'routes')
    ,   scheduler           = require(process.env.FOOD_HOME + 'modules/scheduler')
    ,   mealsDB             = require(process.env.FOOD_HOME + 'modules/db/meals')
    ,   signupsDB           = require(process.env.FOOD_HOME + 'modules/db/signups')
    ,   jwt                 = require(process.env.FOOD_HOME + 'modules/auth/jwt')
    ,   version             = require(process.env.FOOD_HOME + 'modules/cache').getVersion
    ,   server_port         = process.env.FOOD_PORT
    ,   server_ip_address   = 'localhost'

    ,   sslServer = https.createServer({
            key: fs.readFileSync(process.env.SSLKEY),
            cert: fs.readFileSync(process.env.SSLCERT)
        }, app);

sslServer.listen(server_port, server_ip_address, () => {
    console.log('listening on port '+ server_port);
});

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(compression());
app.use(xssFilter());
app.set('x-powered-by', false);

// connect router
app.use('/', routes);

// if not connected to a route, deliver static content
app.use('/static/', express.static(process.env.FOOD_CLIENT + ''));

// exception for sw and manifest, needs to be in root
app.use('/sw.js', express.static(process.env.FOOD_CLIENT + 'sw.js'));
app.use('/manifest.json', express.static(process.env.FOOD_CLIENT + 'manifest.json'));

app.use(jwt.checkToken);
// if no route and no static content, redirect to index
app.get('*', (req, res) => {
    let meals = mealsDB.getAllMeals(),
        signups = signupsDB.getAllSignups(),
        file = new Promise((resolve, reject) => {
                fs.readFile(process.env.FOOD_CLIENT + 'index.html', 'utf8', (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(data);
                });
            });

    Promise.all([file, meals, signups])
        .then(data => {
            let file = data[0],
                meals = data[1],
                signups = data[2];

            meals = meals.map(meal => {
                meal.signups = signups.filter(signup => signup.meal === meal.id).map(signup => signup.id);
                return meal;
            });

            signups = signups.reduce((acc,signup) => {
                acc[signup.id] = signup;
                return acc;
            }, {});

            res.status(200).send(file.replace(
                '<script>/**DEFAULTSTORE**/</script>',
                `<script>
                    window.defaultStore = {
                        user:${req.auth ? JSON.stringify(req.user) : "{name:''}"},
                        app:{dialog:'', errors:{}, dataversion: ${version()}},
                        meals:${JSON.stringify(meals)},
                        signups:${JSON.stringify(signups)}
                    }
                </script>`
            ));
        })
        .catch(err => {
            console.log(err);
            res.status(200).sendFile(process.env.FOOD_CLIENT + 'index.html');
        })
});

// load scheduler
scheduler.init();
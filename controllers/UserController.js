import express from 'express';
import { flash } from 'express-flash-message';
import {authenticate, setUserPassword} from "../service/Security.js";

const router = express.Router();

/**
 * Zobrazit formular pre zadanie mena a hesla
 */
router.get("/login", function (req, res) {
    res.render('login/form.twig');
});

/**
 * Zobrazit formular pre zmenu a hesla
 */
router.get("/change", function (req, res) {
    res.render('login/change.twig');
});


/**
 * Kontrola prihlasovacich udajov odoslanych z formulara metodou POST.
 */
router.post("/check",  function (req, res) {
    // data z formulara su ulozene v tele (body) POST poziadavky.
    authenticate(req.body.username, req.body.password).then(async (user) => {
        if (user) {
            req.session.user = user;
            console.log('Login OK', user);
            await req.flash('success', 'Login OK');
            // kedze pouzivam pomalsie ulozisko pre session data (subory) pockam na ulozenie sesison a az potom presmerujem
            req.session.save(() => {
                res.redirect('/');
            });
        } else {
            console.log('Login failed');
            await req.flash('error', 'Chybné meno alebo heslo!');
            res.redirect('/user/login');
        }
    });
});

/**
 * Kontrola zhody hesiel pre zmenu hesla
 */
router.post("/change",  async function (req, res) {
    // data z formulara su ulozene v tele (body) POST poziadavky.
    if(req.body.password1 === req.body.password2){
        await setUserPassword(req.session.user.username, req.body.password1);
        await req.flash('success', 'Zmena hesla prebehla vporiadku!');
        res.redirect('/');
    } else {
        await req.flash('error', 'Hesla sa nezhoduju');
        res.redirect('/user/change');
    }
});

/**
 * Odhlasit prihlaseneho pouzivatela a zrusit session
 */
router.get("/logout", function (req, res) {
    let sessionName = req.session.name;
    req.session.destroy(async function(err) {
        if (err) {
            console.error(err);
        } else {
            res.clearCookie(sessionName);
            res.redirect('/');
        }
    });
});

export {router as UserController}


import express from 'express';
import {authorize} from '../service/Security.js';
import * as Posts from "../service/Posts.js";
import * as Comments from "../service/Comments.js";

const router = express.Router();

/**
 * Zobrazit nastavajuce prispevky
 */
router.get("/recepty", async function (req, res) {
    // vyhladam v DB vsetky prispevky
    let posts = await Posts.findUpcomingPosts();

    res.render('index/recepty.twig', {
        posts: posts
    });
});
//Мой вариант, как отобразить ингредиенты
router.get("/recepty", async function (req, res) {
    // vyhladam v DB vsetky prispevky
    let ingredient = await Posts.findUpcomingIngredient();

    res.render('index/recepty.twig', {
        ingredient: ingredient
    });
});

/**
 * Zobrazit vsetky prispevky (pre admina)
 */
router.get("/admin", async function (req, res) {
    // vyhladam v DB vsetky prispevky
    let posts = await Posts.findAllPosts();

    res.render('index/admin.twig', {
        posts: posts
    });
});


/**
 * Zoradenie postov podla nazvu
 */
router.get("/orderbyname", async function (req, res) {
    // vyhladam v DB vsetky prispevky
    let posts = await Posts.orderByName();

    res.render('index/recepty.twig', {
        posts: posts
    });
});


/**
 * Redirect na updatenutie podujatia (updatered- update redirect)
 */
router.get("/updatered/:ID", async function (req, res) {
    let postinfo = await Posts.getPost(req.params.ID);
    let ID = req.params.ID
    res.render('index/update.twig', {
        post: postinfo,
        ID: ID
    });

});

/**
 * Redirect na osobitnu stranku postu s komentarmi
 */
router.get("/pod_info/:ID", async function (req, res) {
    let postinfo = await Posts.getPost(req.params.ID);
    let comments = await Comments.findAllComments(req.params.ID);
    let ID = req.params.ID
    res.render('index/pod_info.twig', {
        post: postinfo,
        ID: ID,
        comments: comments
    });

});

/**
 * Vymazat prispevok a prejst na zoznam prispevkov
 */
router.get('/delete/:ID', authorize('admin'), async function(req, res) {
    // pockat na dokoncenie funkcie pre pridanie prispevku
    await Comments.deleteCommentsOfPost(req.params.ID);
    await Posts.deletePost(req.params.ID);
    await req.flash('success', 'Príspevok bol vymazany.')

    // presmerovat na zobrazenie vsetkych prispevkov

    res.redirect('/post/admin');
})

/**
 * Updatenut prispevok a prejst na zoznam prispevkov pre admina
 */
router.post('/update/:ID', authorize('admin'), async function(req, res) {
    // pockat na dokoncenie funkcie pre editnutie prispevku
    await Posts.updatePost(req.body.nazov, req.body.postup, req.body.cas_pripravy, req.body.narocnost, req.body.kategoria, req.params.ID);
    await req.flash('success', 'Príspevok bol zmeneny.')

    // presmerovat na zobrazenie vsetkych prispevkov (admin)
    res.redirect('/post/admin');
})

/**
 * Pridat novy prispevok cez formular.
 *
 * Pridavat prispevky moze len prihlaseny pouzivatel s rolou user alebo admin.
 */
router.post("/new", authorize('user', 'admin'), async function (req, res) {
    // pockat na dokoncenie funkcie pre pridanie prispevku
    await Posts.addPost(req.body.nazov, req.body.postup, req.body.cas_pripravy, req.body.narocnost, req.body.kategoria);
    //pridanie ingredientov
    await Posts.addIngrediencia(req.body.ingredient, req.body.cislo, req.body.jednotka);
    await req.flash('success', 'Príspevok bol pridaný.')

    // presmerovat na zobrazenie vsetkych prispevkov
    res.redirect('/post/admin');
});

export {router as PostController}
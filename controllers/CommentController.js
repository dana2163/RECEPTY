import express from 'express';
import {authorize} from '../service/Security.js';
import * as Comments from "../service/Comments.js";

const router = express.Router();

/**
 * Pridat komentar
 */
router.post("/add/:ID", async function (req, res) {
    // pockat na dokoncenie funkcie pre pridanie komentaru
    await Comments.addComment(req.params.ID, req.body.autor, req.body.message);
    await req.flash('success', 'Príspevok bol pridaný.');

    // presmerovat na konkretny prispevok
    let ID = req.params.ID;
    res.redirect('/post/pod_info/' + ID);
});

/**
 * Vymazat komentar
 */
router.get('/delete/:id/:postId', authorize('admin'), async function(req, res) {
    // pockat na dokoncenie funkcie pre vymazanie komentaru
    await Comments.deleteComment(req.params.id);
    await req.flash('success', 'Príspevok bol vymazany.')

    // presmerovat na konkretny prispevok

    let postId = req.params.postId;
    res.redirect('/post/pod_info/' + postId);
})

export {router as CommentController}
import * as Db from "./MariaClient.js";

/**
 * Vlozit novy komentar
 *
 * @param postId
 * @param autor
 * @param message
 * @returns {Promise<*>}
 */

async function addComment(postId, autor, message) {
    await Db.query(
        'INSERT INTO comments (post_id, autor, message, created_at) VALUES (:post_id, :autor, :message, now())',
        {post_id: postId, autor: autor, message: message}
    );
}

/**
 * Vymazat komentar
 *
 * @param commId
 * @returns {Promise<*>}
 */

async function deleteComment(commId) {
    await Db.query(
        'DELETE FROM comments WHERE id = :commId',
        {commId: commId}
    );
}

/**
 * Vymazat vsetky komentare daneho postu
 *
 * @param postId
 * @returns {Promise<*>}
 */
async function deleteCommentsOfPost(postId) {
    await Db.query(
        'DELETE FROM comments WHERE post_id = :postId',
        {postId: postId}
    );
}

/**
 * Najst vsetky komentare
 */
async function findAllComments(postId) {
    return Db.query('SELECT * FROM comments WHERE post_id = :postId ORDER BY created_at ASC',
        {postId: postId}
    );
}

export {addComment, deleteComment, findAllComments, deleteCommentsOfPost}
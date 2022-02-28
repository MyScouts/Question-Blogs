const router = require('express-promise-router')()
const passport = require('passport')
const passportConfig = require('../middleware/passport')
const { validationBody, validationQuery, baseSchema } = require('../validator')
const postController = require('../controllers/PostController')
const postSchemas = require('../validator/post')
//
router.route('/')
    .get(
        passport.authenticate('jwt', { session: false }),
        validationQuery(baseSchema.page, 'page'),
        validationQuery(baseSchema.pageSize, 'pageSize'),
        postController.getMyPostsMethod)
    .post(
        passport.authenticate('jwt', { session: false }),
        validationBody(postSchemas.createPost),
        postController.createPostMethod
    )
router.route('/get-all')
    .get(
        validationQuery(baseSchema.page, 'page'),
        validationQuery(baseSchema.pageSize, 'pageSize'),
        postController.getAllPostsMethod
    )
router.route('/:postId/like')
    .post(
        passport.authenticate('jwt', { session: false }),
        postController.likePostMethod
    )

router.route('/:postId')
    .get(
        postController.getPostByIdMethod
    )


module.exports = router
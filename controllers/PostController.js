const { PAGINATE_CONFIG } = require("../common/config");
const { responseSuccess } = require("../common/response");
const NotificationModel = require("../models/NotificationModel");
const PostModel = require("../models/PostModel");
const UserLikePostModel = require("../models/UserLikePostModel");
const UserModel = require("../models/UserModel");
const generateSequence = require("../utils/Sequence");

const createPostMethod = async (req, res) => {
    const userId = req.user.userId
    const { content, subject, grade, level, status, price, couponId } = req.value.body;

    const postId = await generateSequence("POST", userId);
    const post = await PostModel.create({ content, subject, grade, level, status, price, couponId, postId, userId });

    const teachers = await UserModel.find({ roles: "teacher" })
    teachers.forEach(async teacher => {
        if (teacher.userId !== userId) {
            await NotificationModel.create({
                title: "New post",
                content: `${req.user.firstName} ${req.user.lastName} has posted a new post`,
                to_userId: teacher.userId,
                form_userId: userId,
                type: "question",
                isRead: false,
                data: postId
            })
        }
    })
    return responseSuccess(res, 200, "Create post successfully!", post)
}

// Like post method
const likePostMethod = async (req, res) => {
    const userId = req.user.userId
    const { postId } = req.params;

    const post = await PostModel.findOne({ postId });
    if (!post) return responseSuccess(res, 400, "Post not found");

    const checkLike = await UserLikePostModel.findOne({ userId, postId });

    if (checkLike) {
        await UserLikePostModel.deleteOne({ userId, postId });
        return responseSuccess(res, 200, "Unlike post successfully!");
    } else {
        await UserLikePostModel.create({ userId, postId });
        if (post.userId !== userId) {
            await NotificationModel.create({
                title: "New like",
                content: `${req.user.firstName} ${req.user.lastName} has liked your post`,
                to_userId: post.userId,
                form_userId: userId,
                type: "like",
                isRead: false,
                data: postId
            })
        }
        return responseSuccess(res, 200, "Like post successfully!")
    }
}

const getMyPostsMethod = async (req, res) => {
    const userId = req.user.userId
    const { page, pageSize } = req.value.query;

    const postsQuery = PostModel.aggregate([
        {
            $match: {
                userId
            }
        },
        {
            $lookup: {
                from: "user_like_posts",
                let: { postId: "$postId" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$postId", "$$postId"] },
                                ]
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "userId",
                            foreignField: "userId",
                            as: "user"
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            postId: 1,
                            userId: 1,
                            firstName: { $arrayElemAt: ["$user.firstName", 0] },
                            lastName: { $arrayElemAt: ["$user.lastName", 0] },
                            avatar: { $arrayElemAt: ["$user.avatar", 0] },

                        }
                    }
                ],
                as: "likes"
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $project: {
                _id: 0,
                postId: 1,
                content: 1,
                subject: 1,
                grade: 1,
                level: 1,
                status: 1,
                price: 1,
                couponId: 1,
                createdAt: 1,
                updatedAt: 1,
                userId: 1,
                likes: 1,
            }

        }, {
            $addFields: {
                likeCount: {
                    $size: "$likes"
                }
            }
        }
    ])

    const post = await PostModel.aggregatePaginate(postsQuery, PAGINATE_CONFIG(page, pageSize));
    return responseSuccess(res, 200, "Get my posts successfully!", post)
}

const getPostByIdMethod = async (req, res) => {
    const postId = req.params.postId;

    const post = await PostModel.aggregate([
        {
            $match: {
                postId
            }
        },
        {
            $lookup: {
                from: "user_like_posts",
                let: { postId: "$postId" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$postId", "$$postId"] },
                                ]
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "userId",
                            foreignField: "userId",
                            as: "user"
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            postId: 1,
                            userId: 1,
                            firstName: { $arrayElemAt: ["$user.firstName", 0] },
                            lastName: { $arrayElemAt: ["$user.lastName", 0] },
                            avatar: { $arrayElemAt: ["$user.avatar", 0] },

                        }
                    }
                ],
                as: "likes"
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $project: {
                _id: 0,
                postId: 1,
                content: 1,
                subject: 1,
                grade: 1,
                level: 1,
                status: 1,
                price: 1,
                couponId: 1,
                createdAt: 1,
                updatedAt: 1,
                userId: 1,
                likes: 1,
            }

        }, {
            $addFields: {
                likeCount: {
                    $size: "$likes"
                }
            }
        }
    ])

    if (!post) return responseSuccess(res, 400, "Post not found");

    return responseSuccess(res, 200, "Get post by id successfully!", post[0])
}



module.exports = {
    createPostMethod,
    likePostMethod,
    getMyPostsMethod,
    getPostByIdMethod
}
-- CreateTable
CREATE TABLE `blog_comments` (
    `id` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,

    `blogPostId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    `isApproved` BOOLEAN NOT NULL DEFAULT false,

    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `createdBy` VARCHAR(191) NULL,
    `updatedBy` VARCHAR(191) NULL,

    INDEX `blog_comments_blogPostId_idx`(`blogPostId`),
    INDEX `blog_comments_userId_idx`(`userId`),
    INDEX `blog_comments_isApproved_idx`(`isApproved`),
    INDEX `blog_comments_createdAt_idx`(`createdAt`),
    INDEX `blog_comments_deletedAt_idx`(`deletedAt`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `blog_comments` ADD CONSTRAINT `blog_comments_blogPostId_fkey`
FOREIGN KEY (`blogPostId`) REFERENCES `blog_posts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blog_comments` ADD CONSTRAINT `blog_comments_userId_fkey`
FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

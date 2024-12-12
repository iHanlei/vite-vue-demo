<template>
  <div class="flex items-center justify-center gap-4">
    <a :href="shareUrls.facebook" target="_blank">Facebook</a>
    <a :href="shareUrls.twitter" target="_blank">Twitter</a>
    <a :href="shareUrls.linkedin" target="_blank">LinkedIn</a>
    <a :href="shareUrls.telegram" target="_blank">Telegram</a>
    <a :href="shareUrls.tiktok" target="_blank">TikTok</a>
    <a :href="shareUrls.email" target="_blank">Email</a>
    <a :href="shareUrls.instagram" target="_blank">Instagram</a>
    <a :href="shareUrls.youtube" target="_blank">YouTube</a>
    <a :href="shareUrls.reddit" target="_blank">Reddit</a>
  </div>
</template>

<script>
export default {
  data() {
    const url = "https://evan.io" // 替换为你的内容 URL
    const text = "Check out this amazing content!" // 自定义内容
    const title = "Share Title" // 自定义标题
    const emailSubject = "Amazing Content" // 邮件主题
    const emailBody = "Hey, check this out: https://evan.io" // 邮件正文
    const hashtags = "vue,share,web" // 可选的标签，用逗号分隔
    const tiktokUsername = "cnliziqi" // 替换为 TikTok 用户名
    const instagramUsername = "your_instagram_username" // 替换为 Instagram 用户名
    const youtubeChannel = "your_youtube_channel" // 替换为 YouTube 频道
    const redditSubreddit = "your_subreddit" // 替换为 Reddit 子版块

    return {
      shareUrls: {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(
          url
        )}&hashtags=${encodeURIComponent(hashtags)}`,
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
          url
        )}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(text)}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
        tiktok: `https://www.tiktok.com/@${encodeURIComponent(tiktokUsername)}`, // 用户主页链接
        email: `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`,
        instagram: `https://www.instagram.com/${encodeURIComponent(instagramUsername)}`, // Instagram 个人主页链接
        youtube: `https://www.youtube.com/channel/${encodeURIComponent(youtubeChannel)}`, // YouTube 频道链接
        reddit: `https://www.reddit.com/r/${encodeURIComponent(redditSubreddit)}/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, // Reddit 提交链接
      },
    }
  },
}
</script>

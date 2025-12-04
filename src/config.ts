export const SITE = {
  website: "https://blog-lihongjie0209s-projects.vercel.app/", // replace this with your deployed domain
  author: "李宏杰",
  profile: "https://github.com/lihongjie0209",
  desc: "全栈开发者，专注于 Java、Rust、Python、TypeScript 技术栈，分享技术实践与心得。",
  title: "李宏杰的博客",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "编辑此页",
    url: "https://github.com/lihongjie0209/astro-blog/edit/master/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "zh-CN", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Shanghai", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;

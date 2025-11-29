/**
 * =============================================================================
 * 📂 资源数据中心 (Resource Data Center)
 * =============================================================================
 */

// 1. ⭐ 分类配置 (在这里管理你的按钮)
const categoryConfig = [
    { type: 'all',      name: '全部' },       // 第一个必须是全部
    { type: 'fc', name: '翻唱下载' },
    { type: 'qt',     name: '稀奇古怪' },
    { type: 'project',  name: '混音机架' },
    { type: 'back', name: '翻唱的伴奏' },
    // 💡 你可以在这里随时添加新分类，比如：
    // { type: 'video', name: '视频素材' },
];

// 2. ⭐ 资源列表
const resources = [
    {
        id: 1,
        title: "《未行之路》男声翻唱！",
        type: "fc", 
        date: "2024-12-28", 
        desc: "我的24年年度歌曲哇！内心里其实真的还是很喜欢这个游戏的呀，但是身体已经不想打开了。伴奏是降了几个半音的调的",
        cover: "/download/资源仓库文件/未行之路/1.jpg", 
        emoji: "", 
        size: "WAV | 53.4MB",
        link: "/download/资源仓库文件/未行之路/未行之路.wav" 
    },
    {
        id: 2,
        title: "《喃喃萤火》男声翻唱哇！",
        type: "fc",
        date: "2025-01-07",
        desc: "喜欢warma！！已经完全爱上沃玛辣！又是突然顿悟了一点，重新混了一下，好听多了",
        cover: "/download/资源仓库文件/喃喃萤火/1.jpg", 
        emoji: "🎹", 
        size: "WAV |60.3MB",
        link: "/download/资源仓库文件/喃喃萤火/喃喃萤火.wav"
    },
    {
        id: 3,
        title: "《芭蕉夜雨》翻唱！",
        type: "fc",
        date: "2025-03-10",
        desc: "想和你一起书写我们的故事",
        cover: "/download/资源仓库文件/芭蕉夜雨/1.jpg", 
        size: "WAV | 60.8MB",
        link: "/download/资源仓库文件/芭蕉夜雨/芭蕉夜雨.wav"
    },
    {
        id: 4,
        title: "《ほろよい/微醺》男声翻唱！",
        type: "fc",
        date: "2025-04-06",
        desc: "24年最后一天，一个人在学校后山喝洒录歌喔\n正儿八经第一次喝酒，果然不好喝\n微醺着唱“ほろよい”\n视频大部分是摸黑下山录的呀\n好晕.....好悬没有摔倒\n希望明年能有个能陪我跨年的她",
        cover: "/download/资源仓库文件/微醺/1.jpg",
        size: "WAV | 55.9MB",
        link: "/download/资源仓库文件/微醺/ほろよい（微醺）.wav"
    },
    {
        id: 5,
        title: "《我的悲伤是水做的》男生乱七八糟の翻唱",
        type: "fc",
        date: "2025-04-13",
        desc: "混了好久的音，明明和声混的好轻松，但是其他的怎么混都不对劲。\n“心里凉得透透的”\n果然是技艺不精，明显的感受到响度战争了，折腾不动了，后面有时间整出更好的再换原罢....\n\n睡！！！",
        cover: "/download/资源仓库文件/悲伤水/1.jpg",
        size: "WAV | 57.0MB",
        link: "/download/资源仓库文件/悲伤水/我的悲伤是水做的.wav"
    },
    {
        id: 6,
        title: "《Ginger》男声翻唱！",
        type: "fc",
        date: "2025-04-20",
        desc: "亲爱的，你像一只大橘喵~\n突然刷到一个小视频<a href='https://www.bilibili.com/video/BV1zMdhYPEsm' target='_blank'>她是悄悄溜进来的光</a>，然后背景音乐音乐是这首歌，真的好好听，果断搜歌，然后翻唱，但是给孩子难飞了[捂眼]\n最喜欢这首歌2:12那里，只剩下电吉他（应该是吧）和拍手声，听起来好清爽！！！[星星眼]\n\n折腾了好久欸，我自己果然也是猫，但是是“夜猫子”的“猫”\n附上今天VRC拍的美图，这个猫是“猫鲨”的“猫”[傲娇]",
        cover: "/download/资源仓库文件/ginger/1.jpg",
        size: "WAV | 51.0MB",
        link: "/download/资源仓库文件/ginger/Ginger.wav"
    },
    {
        id: 7,
        title: "《卸装》男声翻唱！",
        type: "fc",
        date: "2025-04-23",
        desc: "“换一身舒服衣裳，月光下，你真的漂亮”\n\n照镜子不好看一定是镜子的问题！拍照不好看一定是手机的问题！别人说你不好看一定是别人的问题！自己认为不好看一定是还没睡醒的问题！大家本来就都是最棒的！！",
        cover: "/download/资源仓库文件/卸装/1.png",
        size: "WAV | 76.3MB",
        link: "/download/资源仓库文件/卸装/卸妆.wav"
    },
    {
        id: 8,
        title: "《想和你迎着台风去看海》男声翻唱！",
        type: "fc",
        date: "2025-04-26",
        desc: "听这首歌心情会变好！！！\n\n终于升级设备了！从动圈换成电容之后，感觉唱着都没那么费力了。\n用新麦克风唱的第一首歌喔！",
        cover: "/download/资源仓库文件/台风看海/1.jpg",
        size: "WAV | 37.3MB",
        link: "/download/资源仓库文件/台风看海/迎着台风去看海.wav"
    },
    {
        id: 9,
        title: "《屑屑》男声翻唱！",
        type: "fc",
        date: "2025-04-27",
        desc: "给<a href='https://www.bilibili.com/video/BV14qozYgEWY' target='_blank'>比赛</a>画句号来啦，虽然最后没拿到什么名次，但是玩的开心最重要！\nchilichill的歌听完之后，生活的里的光会变多呦~~\n（新麦克风真好用！）",
        cover: "/download/资源仓库文件/屑屑/1.png",
        size: "WAV | 66.9MB",
        link: "/download/资源仓库文件/屑屑/屑屑.wav"
    },
    {
        id: 10,
        title: "《不虚此行（On The Journy）》翻唱！",
        type: "fc",
        date: "2025-04-28",
        desc: "二周年快乐！！新的周年卡池能不能对我好点......\n\n嘻嘻，从哪里找又听aimer又听七里桥又会翻唱星铁的歌的人呐",
        cover: "/download/资源仓库文件/不虚此行/1.jpg",
        size: "WAV | 42.8MB",
        link: "/download/资源仓库文件/不虚此行/on the journy.wav"
    },
    {
        id: 11,
        title: "《夏天的风》男声翻唱！",
        type: "fc",
        date: "2025-05-03",
        desc: "不知道乱七八糟录了些啥，但是怪可爱的....\n\n不知道说什么，总之爷真可爱！！\n就是唱的太一般了（哭\n\n感谢<a href='https://space.bilibili.com/3546651958446128' target='_blank'>@瓶装水晶葡萄</a>点歌",
        cover: "/download/资源仓库文件/夏天的风/1.png",
        size: "WAV | 84.3MB",
        link: "/download/资源仓库文件/夏天的风/夏天的风.wav"
    },
    {
        id: 12,
        title: "《ねぇねぇねぇ。 (呐呐呐。)》正太音x少年音合作の中填翻唱！",
        type: "fc",
        date: "2025-05-05",
        desc: "vocal：<a href='https://space.bilibili.com/168115760' target='_blank'>@爻舜</a> &<a href='https://space.bilibili.com/3546855887604227' target='_blank'>@雾阻_wuzu</a>\nmix：<a href='https://space.bilibili.com/168115760' target='_blank'>@爻舜</a>\n中翻原唱：<a href='https://space.bilibili.com/755370' target='_blank'>@kinsen</a> &<a href='https://space.bilibili.com/1677445' target='_blank'>@喵☆酱</a>\n本家：<a href='https://www.bilibili.com/video/BV1aL411n7tQ' target='_blank'>BV1aL411n7tQ</a>（如侵权，请告知我删除，谢谢！）\n手书：<a href='https://www.bilibili.com/video/BV1kL411G7iE' target='_blank'>BV1kL411G7iE</a>（如侵权，请告知我删除，谢谢！）\n------------------------\n制作者的留言：\n●爻舜：孩子邀请我一起翻唱这首歌，真的超级礼貌一个宝宝，而且声音超级可爱，真的要被萌化了，唱的也很好听欸！中间还一直说麻烦我了，还有对不起什么的，但是能找我一起玩，我就真的已经很开心了哇。还有呀，要有自信一点哇，你的声音真的是被天使吻过的呀！\n\n●雾阻_wuzu：超级超级超级荣幸爻舜老师可以陪我唱这首！还是前天说的事情今天就已经唱完了呜呜呜爻舜老师好厉害（不断地夸夸。。。真的超厉害的又唱得好听。。。（哭）谢谢爻舜老师我们下次再玩！！",
        cover: "/download/资源仓库文件/呐呐呐/1.jpg",
        size: "WAV | 77.2MB",
        link: "/download/资源仓库文件/呐呐呐/ねぇねぇねぇ。 (呐呐呐。).wav"
    },
    {
        id: 13,
        title: "《时光盲盒》男声翻唱！",
        type: "fc",
        date: "2025-05-17",
        desc: "“会变好的，明天的事，明天再说”毕业季快乐！！！\n\n毕业季快到啦！！！\n仔细一想，上一年的这个时候，\n我居然还是紧张和焦虑的要死的高三考生，\n一路走来只觉得，\n人生的容错比想象中的大得多呀，\n每次一度以为天要塌下来的事，\n现在转过头去看，\n好像也没有那么严重，\n总之提前祝全国考生毕业快乐，\n考什么都上岸！！！\n\n就算狼狈\n也能微笑对自己说\n“辛苦了”\n可以哭了......\n可以笑着说结束了\n\n真的很喜欢时光盲盒，这真的是我拜年纪里面印象最深的单品了，\n这次也是提前录好了歌，打磨了好久\n希望大家喜欢！！！",
        cover: "/download/资源仓库文件/时光盲盒/1.png",
        size: "FLAC | 35.8MB",
        link: "/download/资源仓库文件/时光盲盒/爻舜 - 时光盲盒.flac"
    },
    {
        id: 14,
        title: "《下等马》玩世不恭的少年音翻唱！",
        type: "fc",
        date: "2025-05-31",
        desc: "最速翻唱传说!!!\n\n好快好快翻唱了，这首歌太帅了！！！\n但是好难，唱的依托也发了qwq",
        cover: "/download/资源仓库文件/下等马/1.png",
        size: "WAV | 68.4MB",
        link: "/download/资源仓库文件/下等马/下等马.wav"
    },
    {
        id: 15,
        title: "杨默依《春水》超甜男声翻唱（好羞人）",
        type: "fc",
        date: "2025-07-05",
        desc: "旋律和编曲都和德芙一样丝滑呀，超好听的小甜歌！！！\n\n呜呜呜，失踪人口回归，终于放假了。\n超级喜欢这首歌的旋律，歌词也很甜哇！\n超喜欢moi姐姐的歌！\n唱完感觉心情都变好了！\n\n我还真是风格多变呀~~\n而且哇，弱混听起来居然还不错",
        cover: "/download/资源仓库文件/春水/1.png",
        size: "WAV | 58.8MB",
        link: "/download/资源仓库文件/春水/春水.wav"
    },
    {
        id: 16,
        title: "《啊！美丽卡洛》男声慵懒翻唱~",
        type: "fc",
        date: "2025-07-20",
        desc: "因为一些事情耽误了翻唱竞速........\n\n........唔，我到底在干什么\n大家一定要自爱\n\n自以为早已长大已变得很成熟\n可尝了一口\n依然觉得好苦涩.........",
        cover: "/download/资源仓库文件/美丽卡洛/1.jpg",
        size: "WAV | 83.6MB",
        link: "/download/资源仓库文件/美丽卡洛/啊！美丽卡洛.wav"
    },
    {
        id: 17,
        title: "《兔子先生》男声翻唱呀。",
        type: "fc",
        date: "2025-08-02",
        desc: "“有人会牵挂，让人羡慕啊，别惹我哭啦”\n\n呜呜呜为了把流量推广用了直接赶了半天awa\n\n呜呜感觉一开始的mix思路就有问题，改了好多次终于感觉将就能听了",
        cover: "/download/资源仓库文件/兔子先生/1.png",
        size: "WAV | 77.1MB",
        link: "/download/资源仓库文件/兔子先生/兔子先生.wav"
    },
    {
        id: 18,
        title: "七夕特供BE翻唱《消散对白》",
        type: "fc",
        date: "2025-08-29",
        desc: "“可你眼中深情的对白，如烟花短暂，新鲜感终归不是爱。”\n\n制作者的留言：\n●寒川渡：在ddl之前成功催爻舜老师搞出来了！！！！！非常完美的be！而且非常的好听！！！！！明年不be了，争取搞点小甜饼(´つヮ⊂︎)\n\n●爻舜：呜呜呜，再也不ddl了，最后成品真的好棒，寒老师和我也都好棒呜，下次七夕继续一起搞be.....（坏笑）",
        cover: "/download/资源仓库文件/消散对白/1.png",
        size: "WAV | 63.2MB",
        link: "/download/资源仓库文件/消散对白/消散对白.wav"
    },
    {
        id: 19,
        title: "和凯凯哥哥合唱的《演》！！！",
        type: "fc",
        date: "2025-10-18",
        desc: "凯凯说：这次和可爱的小爻合作了！\n原谅我这首歌发的这么慢，制作*内容 和 *环节真的有些多！\n音乐制作方面这次也是叠轨大王，录了十多轨和声！\n也算是完整的！完成啦！\n----------------------------------\nvideo剪辑：<a href='https://space.bilibili.com/168115760' target='_blank'>@爻舜</a>\nMix.Master / 视频后期 / 字幕动效：<a href='https://space.bilibili.com/195469924' target='_blank'>@凯凯KaKai</a>\n原唱：\n<a href='https://space.bilibili.com/23200685' target='_blank'>@cu夏_ChiliChill</a> <a href='https://space.bilibili.com/90942983' target='_blank'>@YuH_ChiliChill</a>  感谢ChiliChill 他们真的超级棒！",
        cover: "/download/资源仓库文件/演/1.jpg",
        size: "MP3 | 8.07MB",
        link: "/download/资源仓库文件/演/演_凯-爻.mp3"
    },
    {
        id: 20,
        title: "《A Seat For You》男声翻唱",
        type: "fc",
        date: "2025-10-24",
        desc: "“我每每都不顾一切地坠入爱河，明知自己配不上你的温柔”\n呜呜其实是复健\n真的好久没有唱歌了\n最近真的好忙\n\n日推到的好听的歌\n循环播放了好久\n我好喜欢这种安安静静的感觉\n我也好喜欢他.....",
        cover: "/download/资源仓库文件/asfy/1.png",
        size: "WAV | 52.1MB",
        link: "/download/资源仓库文件/asfy/a seat for you.wav"
    },
    {
        id: 21,
        title: "《衡山路，宛平路》男声翻唱！",
        type: "fc",
        date: "2025-11-29",
        desc: "气死我了呜呜\n\n明明只是一个院级的草地音乐节活动，我居然连初选都没过........初选我是第一个上的，但是我还是听完了每一个人的节目，本来以为稳了.......\n合着评委是完全欣赏不来synth-pop？\n\n能不能告诉我，那种唱的死闷，而且唱的没感情平的没边的是怎么过的？\n\n能不能告诉我，RMB转调转的不知天地为何物，也没几个音在调上的是怎么过的？\n\n能不能告诉我，参都没参加初选的人，到底是怎么过初选的？\n\n哼，是我甩的这个活动！记住了！！！\n活动唱不了.....\n所以干脆自己录了发出来\n这一版compress拉的有点过\n等处理之后再发流媒体吧.......",
        cover: "/download/资源仓库文件/衡山路宛平路/1.jpg",
        size: "WAV | 65.0MB",
        link: "/download/资源仓库文件/衡山路宛平路/衡山路，宛平路.wav"
    },
    {
        id: 22,
        title: "重编曲remix+翻唱《听夜雨》",
        type: "qt",
        date: "2025-9-21",
        desc: "用bb重编曲之后完全重混+翻唱\n\n真正意义上第一次独立制作！\n很demo的demo，肯定不发网站上了呜呜\n\n但是我觉得唱的还行，嘿嘿",
        cover: "/download/资源仓库文件/听夜雨remix和翻唱/1.jpg",
        size: "WAV | 30.8MB",
        link: "/download/资源仓库文件/听夜雨remix和翻唱/听夜雨.wav"
    },

    
    
    // 👇 复制模板 👇
    // {
    //     id: 99,
    //     title: "标题",
    //     type: "dry", 
    //     date: "2025-01-01",
    //     desc: "描述<a href='https://链接' target='_blank'>文本</a>",
    //     cover: "",
    //     emoji: "📦",
    //     size: "ZIP | 0MB",
    //     link: "#"
    // },
];
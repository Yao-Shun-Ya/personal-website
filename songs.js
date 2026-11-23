/* ============================================================
   🎵 歌单配置文件 (songs.js)
   注意：
   1. 格式必须是 { title: "歌名", src: "路径" }
   2. 路径建议使用相对路径，例如 "./download/..."
   ============================================================ */

const MUSIC_DATA = [
    { 
        title: "A Seat For You", 
        src: "./download/资源仓库文件/asfy/a seat for you.wav" 
    },
    { 
        title: "Ginger", 
        src: "./download/资源仓库文件/ginger/Ginger.wav" 
    },
    { 
        title: "下等马", 
        src: "./download/资源仓库文件/下等马/下等马.wav" 
    },
    { 
        title: "On The Journy (不虚此行)", 
        src: "./download/资源仓库文件/不虚此行/on the journy.wav" 
    },
    { 
        title: "兔子先生", 
        src: "./download/资源仓库文件/兔子先生/兔子先生.wav" 
    },
    { 
        title: "卸妆", 
        src: "./download/资源仓库文件/卸装/卸妆.wav" 
    },
    { 
        title: "迎着台风去看海", 
        src: "./download/资源仓库文件/台风看海/迎着台风去看海.wav" 
    },
    { 
        title: "ねぇねぇねぇ (呐呐呐)", 
        src: "./download/资源仓库文件/呐呐呐/ねぇねぇねぇ。 (呐呐呐。).wav" 
    },
    { 
        title: "喃喃萤火", 
        src: "./download/资源仓库文件/喃喃萤火/喃喃萤火.wav" 
    },
    { 
        title: "夏天的风", 
        src: "./download/资源仓库文件/夏天的风/夏天的风.wav" 
    },
    { 
        title: "屑屑", 
        src: "./download/资源仓库文件/屑屑/屑屑.wav" 
    },
    { 
        title: "ほろよい (微醺)", 
        src: "./download/资源仓库文件/微醺/ほろよい（微醺）.wav" 
    },
    { 
        title: "我的悲伤是水做的", 
        src: "./download/资源仓库文件/悲伤水/我的悲伤是水做的.wav" 
    },
    { 
        title: "时光盲盒", 
        src: "./download/资源仓库文件/时光盲盒/爻舜 - 时光盲盒.flac" 
    },
    { 
        title: "春水", 
        src: "./download/资源仓库文件/春水/春水.wav" 
    },
    { 
        title: "未行之路", 
        src: "./download/资源仓库文件/未行之路/未行之路.wav" 
    },
    { 
        title: "消散对白", 
        src: "./download/资源仓库文件/消散对白/消散对白.wav" 
    },
    { 
        title: "演 (feat.凯)", 
        src: "./download/资源仓库文件/演/演_凯-爻.mp3" 
    },
    { 
        title: "啊！美丽卡洛", 
        src: "./download/资源仓库文件/美丽卡洛/啊！美丽卡洛.wav" 
    },
    { 
        title: "芭蕉夜雨", 
        src: "./download/资源仓库文件/芭蕉夜雨/芭蕉夜雨.wav" 
    },
    { 
        title: "衡山路，宛平路", 
        src: "./download/资源仓库文件/衡山路宛平路/衡山路，宛平路.wav" 
    },
    { 
        title: "听夜雨", 
        src: "./download/资源仓库文件/听夜雨remix和翻唱/听夜雨ult.wav" 
    },
    { 
        title: "原風景", 
        src: "./download/资源仓库文件/原风景/原風景.wav" 
    },
    { 
        title: "织风结", 
        src: "./download/资源仓库文件/织风结/织风结.wav" 
    },
    { 
        title: "反乌托邦Pt.2", 
        src: "./download/资源仓库文件/反乌托邦/反乌托邦Pt.2.wav" 
    },
    { 
        title: "还有我们", 
        src: "./download/资源仓库文件/还有我们/还有我们.wav" 
    },
    { 
        title: "辞职信", 
        src: "./download/资源仓库文件/辞职信/辞职信.wav" 
    },
    { 
        title: "人是猫", 
        src: "./download/资源仓库文件/人是猫/人是猫.wav" 
    },
    { 
        title: "numbnumb", 
        src: "./download/资源仓库文件/numbnumb/numb numb.wav" 
    },
    { 
        title: "芭蕉夜雨（周年重制版）", 
        src: "./download/资源仓库文件/芭蕉夜雨（周年重制版）/芭蕉夜雨（周年重录版）.wav" 
    },
    { 
        title: "丑马 (feat.知空)", 
        src: "./download/资源仓库文件/丑马/丑马.wav" 
    },
    { 
        title: "花骨朵", 
        src: "./download/资源仓库文件/花骨朵/花骨朵.wav" 
    },
    { 
        title: "Non-Breath Oblige（小节）", 
        src: "./download/资源仓库文件/Non-breath-oblige（小节）/无义务呼吸（小节）.wav" 
    },
    { 
        title: "泛泛人类不会祈祷", 
        src: "./download/资源仓库文件/泛泛人类不会祈祷/泛泛人类不会祈祷.wav" 
    },
    { 
        title: "重庆之夏", 
        src: "./download/资源仓库文件/重庆之夏/重庆之夏.wav" 
    },
    { 
        title: "Loser baby", 
        src: "./download/资源仓库文件/loserbaby/loser baby.wav" 
    },
    { 
        title: "捉迷藏", 
        src: "./download/资源仓库文件/捉迷藏/捉迷藏.wav" 
    },
    { 
        title: "Celestial Tide", 
        src: "./download/资源仓库文件/CelestialTide/CelestialTide.wav" 
    },
    { 
        title: "风月（小段）", 
        src: "./download/资源仓库文件/风月（小段）/风月（小段）.wav" 
    },
    { 
        title: "岭南小事比赛音频", 
        src: "./download/资源仓库文件/岭南小事比赛音频/岭南小事比赛音频.wav" 
    },
    // 👉 复制上面的花括号块，粘贴到这里加新歌...
    // 注意：最后一个花括号后面不要加逗号，虽然加了也没事
];

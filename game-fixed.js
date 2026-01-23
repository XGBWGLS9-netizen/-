// 游戏状态
let gameState = {
    trust: 70,           // 孙权信任值 (0-100)
    faction: 0,          // 阵营倾向 (-50到50，负数偏太子，正数偏鲁王)
    currentEventIndex: 0,
    gameRunning: false,
    eventsCompleted: 0,
    factionHistory: []   // 记录阵营加入历史
};

// 系统角色 - 暗示孙登身份
const systemCharacter = {
    name: "系统",
    identity: "早逝的最佳皇位继承人孙登",
    hints: [
        "咳咳...系统有点不稳定，可能是因为某位本该成为明君的人过早离世了...",
        "检测到异常波动...如果某个人还活着，这些党争根本不会发生...",
        "系统提示：历史的最大遗憾，往往是最优秀的人过早凋零...",
        "警告：当前时间线偏离最优路径，原因：赤乌四年的那场意外..."
    ]
};

// 事件卡片数据
const events = [
    {
        title: "王夫人之笑",
        description: "陛下孙权病刚好点，王夫人在病房外笑了一下。长公主孙鲁班火速举报她'笑陛下没死成'。史书记载：'全公主谮王夫人，言其见上疾喜'。",
        choices: [
            {
                text: "力证清白：'这是康复的喜悦！'",
                effects: { trust: -5, faction: -10 },
                tags: ["信任-", "太子+"]
            },
            {
                text: "火上浇油：'臣好像也看到她在偷笑。'",
                effects: { trust: -8, faction: 15 },
                tags: ["信任--", "鲁王+"]
            },
            {
                text: "突发恶疾：'哎呀臣头疼先告退了！'",
                effects: { trust: -3, faction: 0 },
                tags: ["信任-"]
            }
        ],
        quotes: [
            { character: "孙权", text: "真当自己是步夫人吗..." },
            { character: "孙权", text: "真当自己是步夫人吗..." },
            { character: "孙权", text: "恍惚间，又回到了初平年间…" }
        ]
    },
    {
        title: "芍陂论功",
        description: "项目大成功，分红方案明显向太子团队倾斜。鲁王团队的骨干全琮气得要提交离职报告。史载：'芍陂之功，太子党居多'。",
        choices: [
            {
                text: "支持方案：'按制度来，公平！'",
                effects: { trust: 0, faction: -15 },
                tags: ["太子+"]
            },
            {
                text: "提议安抚：'给钱塘全氏发个特别红包吧。'",
                effects: { trust: -5, faction: 10 },
                tags: ["信任-", "鲁王+"]
            }
        ],
        quotes: [
            { character: "全琮", text: "制度？呵呵，我看是'太子制度'吧。" },
            { character: "全琮", text: "此恨，我记到绩效考核里了。" }
        ]
    },
    {
        title: "公主的盟友",
        description: "长公主孙鲁班和她的事业伙伴孙峻有些'过度亲密'。她希望你帮忙打打掩护。史书曰：'全公主与峻私通'。",
        choices: [
            {
                text: "加入吃瓜：'放心，我眼神不好。'",
                effects: { trust: 0, faction: 12 },
                tags: ["鲁王+"]
            },
            {
                text: "通知全琮：'我是来上班的，不是来嗑CP的。'",
                effects: { trust: 3, faction: -5 },
                tags: ["信任+", "鲁王-"]
            }
        ],
        quotes: [
            { character: "孙峻（擦汗）", text: "千万…莫让陛下知道。" },
            { character: "全琮", text: "夫人开心就好，我无所谓的。" }
        ]
    },
    {
        title: "杨竺进谗",
        description: "同事杨竺给老板孙权发了一份长长的私密邮件，标题是《关于太子能力不足与鲁王堪称完美的十个事实依据》。史载：'竺谮太子和于权'。",
        choices: [
            {
                text: "转发给太子：'小心！有小人！'",
                effects: { trust: -3, faction: -18 },
                tags: ["信任-", "太子++"]
            },
            {
                text: "给邮件点赞：'臣附议！'",
                effects: { trust: -10, faction: 20 },
                tags: ["信任--", "鲁王++"]
            },
            {
                text: "已读不回",
                effects: { trust: 5, faction: 0 },
                tags: ["信任+"]
            }
        ],
        quotes: [
            { character: "太子", text: "我好害怕呀，上帝…" },
            { character: "杨竺", text: "诸葛兄果然慧眼识珠！咱们是一路人啊！" },
            { character: "孙权", text: "蓝田生玉，真不虚也。（史书原话：权以恪为蓝田生玉）" }
        ]
    },
    {
        title: "太子监国",
        description: "孙权要出差，让太子代理CEO职务。鲁王党集体'生病'请假。史载：'太子和为太子，常忧惧'。",
        choices: [
            {
                text: "力挺太子：'殿下英明神武，必能胜任！'",
                effects: { trust: -5, faction: -20 },
                tags: ["信任-", "太子++"]
            },
            {
                text: "暗中破坏：'殿下确实还需要历练…'",
                effects: { trust: -8, faction: 15 },
                tags: ["信任--", "鲁王+"]
            },
            {
                text: "中立观望：'臣全力配合组织安排。'",
                effects: { trust: 2, faction: 0 },
                tags: ["信任+"]
            }
        ],
        quotes: [
            { character: "太子", text: "诸葛叔叔，你是我在这个冷漠公司里唯一的温暖了！" },
            { character: "鲁王", text: "不愧是琅琊诸葛氏。" },
            { character: "孙权", text: "还是诸葛恪靠谱，不像某些人，一天到晚搞小团体。" }
        ]
    },
    {
        title: "立储风波",
        description: "有大臣上书建议'明确继承人'，孙权脸都黑了。太子和鲁王都在暗中活动，想拉你站队。史载：'权春秋高，而太子、鲁王并有宠爱'。",
        choices: [
            {
                text: "支持太子：'长幼有序，礼法所在！'",
                effects: { trust: -10, faction: -25 },
                tags: ["信任--", "太子+++"]
            },
            {
                text: "暗助鲁王：'能者居之，贤者得位！'",
                effects: { trust: -12, faction: 25 },
                tags: ["信任--", "鲁王+++"]
            },
            {
                text: "装死躲避：'臣最近身体不适，不便参与朝政…'",
                effects: { trust: -3, faction: 0 },
                tags: ["信任-"]
            }
        ],
        quotes: [
            { character: "孙权", text: "诸葛恪啊，你这是要逼我表态吗？" },
            { character: "孙权", text: "诸葛恪啊，你这是要逼我表态吗？" },
            { character: "孙权", text: "虽然你装的很假，但隐约有孤诓骗北方笔友时的气质。" }
        ]
    },
    {
        title: "北伐提案",
        description: "你提出了一个大胆的北伐计划，想要证明自己的能力。但朝中保守派强烈反对。史载：'恪性骄傲，多所轻忽'。",
        choices: [
            {
                text: "坚持己见：'机不可失，时不再来！'",
                effects: { trust: -8, faction: 0 },
                tags: ["信任--"]
            },
            {
                text: "妥协退让：'臣考虑不周，愿意修改方案。'",
                effects: { trust: 3, faction: 0 },
                tags: ["信任+"]
            }
        ],
        quotes: [
            { character: "孙权", text: "年轻人有冲劲是好事，但要量力而行啊。" },
            { character: "孙权", text: "能听进不同意见，这很好。做领导就要这样。" }
        ]
    },
    {
        title: "陆逊之死",
        description: "太子太傅陆逊因为力挺太子，被孙权连发数道诏书责备，最终忧愤而死。朝堂一片肃杀。史载：'逊愤恚致卒'。",
        choices: [
            {
                text: "公开哀悼：'陆公忠贞，天下共知！'",
                effects: { trust: -12, faction: -15 },
                tags: ["信任--", "太子+"]
            },
            {
                text: "明哲保身：'生死有命，富贵在天。'",
                effects: { trust: 2, faction: 0 },
                tags: ["信任+"]
            },
            {
                text: "落井下石：'陆逊固执己见，咎由自取。'",
                effects: { trust: -5, faction: 18 },
                tags: ["信任-", "鲁王++"]
            }
        ],
        quotes: [
            { character: "孙权", text: "诸葛恪，你也想步陆逊后尘吗？" },
            { character: "孙权", text: "还是你聪明，知道什么该说什么不该说。" },
            { character: "孙峻", text: "诸葛兄深明大义，佩服佩服！" }
        ]
    },
    {
        title: "潘皇后离奇死亡",
        description: "深夜传来噩耗，潘皇后在宫中暴毙。宫人们窃窃私语，都说是被人缢杀。朝堂震动，你必须表态。史载：'诸宫人伺其昏卧，共缢杀之'。",
        choices: [
            {
                text: "震惊不解：'这宫女怎么这么大胆？'",
                effects: { trust: -15, faction: -20 },
                tags: ["信任--", "太子++"]
            },
            {
                text: "得瑟智慧：'一定是陛下在为孙亮扫除障碍！'",
                effects: { trust: -8, faction: 25 },
                tags: ["信任--", "鲁王+++"]
            },
            {
                text: "直接质问：'全公主你怎么能让孙峻去杀皇后呢？！big胆！'",
                effects: { trust: -25, faction: 0 },
                tags: ["信任---"]
            }
        ],
        quotes: [
            { character: "孙权", text: "诸葛恪，你是要与朕作对吗？" },
            { character: "孙峻", text: "诸葛兄深明大义，果然是明白人！" },
            { character: "孙鲁班", text: "诸葛恪！你敢污蔑本宫？！" }
        ]
    },
    {
        title: "最后的考验",
        description: "孙权病重，召你入宫托孤。他看着你说：'诸葛恪，朕将江山托付于你，你可愿意？'史载：'权疾困，召恪入，受诏辅政'。",
        choices: [
            {
                text: "慷慨应允：'臣必竭尽全力，死而后已！'",
                effects: { trust: 15, faction: 0 },
                tags: ["信任+++"]
            },
            {
                text: "推辞谦让：'臣德薄能鲜，恐负重托。'",
                effects: { trust: -5, faction: 0 },
                tags: ["信任-"]
            }
        ],
        quotes: [
            { character: "孙权", text: "好！孤果然没有看错你。江山就托付给你了！" },
            { character: "孙权", text: "都这个时候了，还跟孤客套？算了，你还是接着吧。" }
        ]
    }
];

// 结局配置
const endings = [
    {
        condition: (trust, faction) => trust <= 0,
        title: "职场炮灰",
        titleColor: "#e74c3c",
        description: "孙权赐你一杯酒，说是'庆祝你的忠诚'。你知道这意味着什么。\n\n在东吴的职场生涯就此结束，史书上只有一句话：\n'诸葛恪，因言获罪，赐死。'\n\n系统温馨提示：talk less，smile more~"
    },
    {
        condition: (trust, faction) => trust >= 80 && Math.abs(faction) <= 15,
        title: "终极赢家",
        titleColor: "#f1c40f",
        description: "恭喜！你成功在两派之间保持平衡，获得了孙权的绝对信任。\n\n你被任命为辅政大臣，手握大权。史载：'权以恪为托孤之臣'。\n真不错啊（开心）......不对，我好像在史书里看见过这个结局。"
    },
    {
        condition: (trust, faction) => trust >= 60 && trust < 80,
        title: "优秀员工",
        titleColor: "#3498db",
        description: "你成功活到了退休年龄，在东吴做了一辈子的'优秀员工'。\n\n虽然没有大富大贵，但也算安稳一生。\n史书上关于你的记录只有一句：\n'诸葛恪，谨慎持重，善终。'\n\n有时候，平凡就是最大的成功。"
    },
    {
        condition: (trust, faction) => faction <= -30,
        title: "太子党核心",
        titleColor: "#3498db",
        description: "你成为了太子党的核心成员，深得太子信任。\n\n但随着太子最终败给鲁王，你也跟着完蛋了。\n淮泗出身的你，居然同朱公主一起与吴郡氏族为伍，你想起很久以前父亲的一句话：恪不大兴吾家，将大赤吾族也。\n\n下辈子记得：不要把鸡蛋放在一个篮子里。"
    },
    {
        condition: (trust, faction) => faction >= 30,
        title: "鲁王党骨干",
        titleColor: "#e74c3c",
        description: "你成为了鲁王党的得力干将，深度参与了各种'项目'。\n\n虽然鲁王最终获胜，但你发现自己知道得太多了…\n某个深夜，你收到了一杯'庆功酒'。\n一看就是孙峻送来的，该死的舔狗。"
    },
    {
        condition: (trust, faction) => trust >= 40 && faction >= 15,
        title: "权臣之路",
        titleColor: "#9b59b6",
        description: "你成功站队鲁王，并且保持了一定的信任度。\n\n孙权死后，你成为了新朝的重臣。\n史载：'恪辅政，威震朝野'。\n\n真不错啊（开心）......不对，我好像在史书里看见过这个结局。"
    },
    {
        condition: (trust, faction) => trust >= 40 && faction <= -15,
        title: "忠臣之名",
        titleColor: "#27ae60",
        description: "你坚持支持太子，虽然最终失败，但赢得了忠臣的名声。\n\n哎，恍惚间似乎又回到了赤乌4年之前的武昌。\n\n后世史家评价：'诸葛恪虽败犹荣，其忠义可嘉。'"
    },
    {
        condition: (trust, faction) => true, // 默认结局
        title: "平庸一生",
        titleColor: "#95a5a6",
        description: "你在东吴混了一辈子，既没有大成就，也没有大失败。\n\n就像大多数职场人一样，平平淡淡地过完了一生。\n你只被陈寿记载在诸葛瑾传的结尾，什么儿时的'天才'之称，随着孙权的去世一起消失了。\n\n但至少，你活着。有时候这就够了。"
    }
];

// 开始游戏
function startGame() {
    console.log('开始游戏函数被调用');
    
    try {
        document.getElementById('startScreen').style.display = 'none';
        document.getElementById('gameMain').style.display = 'block';
        
        gameState.trust = 70;
        gameState.faction = 0;
        gameState.currentEventIndex = 0;
        gameState.gameRunning = true;
        gameState.eventsCompleted = 0;
        
        updateUI();
        showNextEvent();
        
        console.log('游戏启动成功');
    } catch (error) {
        console.error('启动游戏时出错：', error);
        alert('游戏启动失败：' + error.message);
    }
}

// 更新UI显示
function updateUI() {
    try {
        // 更新信任值
        const trustFill = document.getElementById('trustFill');
        const trustValue = document.getElementById('trustValue');
        if (trustFill && trustValue) {
            trustFill.style.width = Math.max(0, gameState.trust) + '%';
            trustValue.textContent = Math.max(0, gameState.trust);
        }
        
        // 更新阵营指针
        const factionPointer = document.getElementById('factionPointer');
        if (factionPointer) {
            const pointerPosition = ((gameState.faction + 50) / 100) * 100;
            factionPointer.style.left = Math.max(0, Math.min(100, pointerPosition)) + '%';
        }
    } catch (error) {
        console.error('更新UI时出错：', error);
    }
}

// 显示下一个事件
function showNextEvent() {
    try {
        if (gameState.currentEventIndex >= events.length) {
            showEnding();
            return;
        }
        
        const event = events[gameState.currentEventIndex];
        
        document.getElementById('eventTitle').textContent = event.title;
        document.getElementById('eventDescription').textContent = event.description;
        
        // 生成选择按钮
        const choicesContainer = document.getElementById('eventChoices');
        choicesContainer.innerHTML = '';
        
        event.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-btn';
            button.innerHTML = choice.text + ' <small>' + choice.tags.join(' ') + '</small>';
            button.addEventListener('click', () => makeChoice(index));
            choicesContainer.appendChild(button);
        });
    } catch (error) {
        console.error('显示事件时出错：', error);
    }
}

// 做出选择
function makeChoice(choiceIndex) {
    try {
        const event = events[gameState.currentEventIndex];
        const choice = event.choices[choiceIndex];
        
        // 应用效果
        gameState.trust += choice.effects.trust || 0;
        gameState.faction += choice.effects.faction || 0;
        
        // 限制数值范围
        gameState.trust = Math.max(0, Math.min(100, gameState.trust));
        gameState.faction = Math.max(-50, Math.min(50, gameState.faction));
        
        // 特殊事件的系统弹窗
        handleSpecialSystemMessages(event, choiceIndex);
        
        // 检查是否明显偏向某一方并触发系统特效
        checkFactionJoin();
        
        // 更新UI
        updateUI();
        
        // 显示金句
        if (event.quotes && event.quotes[choiceIndex]) {
            showQuote(event.quotes[choiceIndex]);
        }
        
        // 检查是否游戏结束
        if (gameState.trust <= 0) {
            setTimeout(() => showEnding(), 2500);
            return;
        }
        
        // 准备下一个事件
        gameState.currentEventIndex++;
        gameState.eventsCompleted++;
        
        setTimeout(() => {
            showNextEvent();
        }, 2500);
    } catch (error) {
        console.error('处理选择时出错：', error);
    }
}

// 处理特殊事件的系统消息
function handleSpecialSystemMessages(event, choiceIndex) {
    // 王夫人之笑 - 选择火上浇油
    if (event.title === "王夫人之笑" && choiceIndex === 1) {
        setTimeout(() => {
            showSystemPopup("王夫人忧死");
        }, 1500);
    }
    
    // 杨竺进谗 - 太子说到上帝
    if (event.title === "杨竺进谗" && choiceIndex === 0) {
        setTimeout(() => {
            showSystemPopup("这里是三世纪的中国，没有上帝~");
        }, 1500);
    }
    
    // 太子监国 - 孙权的感慨
    if (event.title === "太子监国" && choiceIndex === 2) {
        setTimeout(() => {
            showSystemPopup("父皇，如果您知道未来会发生什么...");
        }, 1500);
    }
    
    // 立储风波 - 孙权的吐槽
    if (event.title === "立储风波" && choiceIndex === 2) {
        setTimeout(() => {
            showSystemPopup("父皇您这是在夸人还是损人...");
        }, 1500);
    }
    
    // 杨竺进谗 - 系统对诸葛恪的感慨
    if (event.title === "杨竺进谗" && choiceIndex === 2) {
        setTimeout(() => {
            showSystemPopup("如果大哥还在，哪轮得到你们这些人...");
        }, 1500);
    }
}

// 检查阵营加入并触发特效
function checkFactionJoin() {
    let newFaction = null;
    
    if (gameState.faction <= -25) {
        newFaction = 'prince';
    } else if (gameState.faction >= 25) {
        newFaction = 'lu';
    }
    
    // 检查是否是新的阵营加入
    if (newFaction && !gameState.factionHistory.includes(newFaction)) {
        gameState.factionHistory.push(newFaction);
        
        const message = newFaction === 'prince' ? '已正式加入太子党' : '已正式加入鲁王党';
        triggerSystemGlitch(message);
    }
}

// 触发系统故障特效
function triggerSystemGlitch(message) {
    const glitch = document.getElementById('systemGlitch');
    const systemMsg = document.getElementById('systemMessage');
    
    // 播放音效
    playGlitchSound();
    
    // 显示马赛克特效（不闪烁）
    glitch.style.display = 'block';
    
    setTimeout(() => {
        glitch.style.display = 'none';
        // 显示系统消息
        systemMsg.textContent = message;
        systemMsg.style.display = 'block';
        
        // 随机显示系统提示
        setTimeout(() => {
            const randomHint = systemCharacter.hints[Math.floor(Math.random() * systemCharacter.hints.length)];
            systemMsg.innerHTML = message + '<br><br><small style="color: #888;">' + randomHint + '</small>';
        }, 1000);
        
        setTimeout(() => {
            systemMsg.style.display = 'none';
        }, 4000);
    }, 2000);
}

// 播放系统崩坏音效
function playGlitchSound() {
    // 创建音频上下文
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // 创建噪音效果
    const duration = 2; // 2秒
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);
    
    // 生成更强烈的兹拉兹拉噪音
    for (let i = 0; i < data.length; i++) {
        // 更强的白噪音
        const whiteNoise = (Math.random() * 2 - 1) * 0.6;
        
        // 多频率混合的低频噪音
        const lowFreq1 = Math.sin(i / sampleRate * 60 * Math.PI * 2) * 0.4;
        const lowFreq2 = Math.sin(i / sampleRate * 120 * Math.PI * 2) * 0.3;
        const midFreq = Math.sin(i / sampleRate * 440 * Math.PI * 2) * 0.2;
        
        // 更频繁更强烈的故障音
        const glitch1 = Math.random() > 0.9 ? (Math.random() * 2 - 1) * 1.2 : 0;
        const glitch2 = Math.random() > 0.95 ? Math.sin(i * 0.1) * 0.8 : 0;
        
        // 数字化失真效果
        const digitalGlitch = Math.random() > 0.92 ? 
            Math.sign(Math.random() - 0.5) * 0.9 : 0;
        
        // 周期性的电流声
        const electricBuzz = Math.sin(i / sampleRate * 1000 * Math.PI * 2) * 
            (Math.random() > 0.8 ? 0.3 : 0);
        
        data[i] = whiteNoise + lowFreq1 + lowFreq2 + midFreq + 
                  glitch1 + glitch2 + digitalGlitch + electricBuzz;
        
        // 限制幅度防止削波
        data[i] = Math.max(-1, Math.min(1, data[i]));
    }
    
    // 播放音效
    const source = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();
    
    source.buffer = buffer;
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // 更大的音量
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.7, audioContext.currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0.6, audioContext.currentTime + 0.5);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
    
    source.start();
}

// 显示系统弹窗（用于其他系统提示）
function showSystemPopup(message) {
    const systemMsg = document.getElementById('systemMessage');
    systemMsg.innerHTML = '<span style="color: #00ff00;">[SYSTEM]</span><br>' + message;
    systemMsg.style.display = 'block';
    
    setTimeout(() => {
        systemMsg.style.display = 'none';
    }, 3000);
}

// 显示金句
function showQuote(quote) {
    try {
        const overlay = document.getElementById('quoteOverlay');
        if (overlay) {
            document.getElementById('quoteCharacter').textContent = quote.character;
            document.getElementById('quoteText').textContent = quote.text;
            overlay.style.display = 'flex';
            
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 2000);
        }
    } catch (error) {
        console.error('显示金句时出错：', error);
    }
}

// 显示结局
function showEnding() {
    try {
        gameState.gameRunning = false;
        
        // 找到匹配的结局
        let selectedEnding = endings[endings.length - 1];
        for (const ending of endings) {
            if (ending.condition(gameState.trust, gameState.faction)) {
                selectedEnding = ending;
                break;
            }
        }
        
        document.getElementById('endingTitle').textContent = selectedEnding.title;
        document.getElementById('endingTitle').style.color = selectedEnding.titleColor;
        document.getElementById('endingDescription').textContent = selectedEnding.description;
        
        document.getElementById('gameMain').style.display = 'none';
        document.getElementById('endingScreen').style.display = 'flex';
    } catch (error) {
        console.error('显示结局时出错：', error);
    }
}

// 重新开始游戏
function restartGame() {
    try {
        document.getElementById('endingScreen').style.display = 'none';
        document.getElementById('startScreen').style.display = 'flex';
        
        // 重置游戏状态
        gameState = {
            trust: 70,
            faction: 0,
            currentEventIndex: 0,
            gameRunning: false,
            eventsCompleted: 0,
            factionHistory: []
        };
    } catch (error) {
        console.error('重启游戏时出错：', error);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('页面加载完成，初始化游戏');
    try {
        updateUI();
    } catch (error) {
        console.error('初始化时出错：', error);
    }
});
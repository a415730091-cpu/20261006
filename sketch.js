// 儲存五題測驗資料，每一題包含題目、四個選項與正確答案索引
const questions = [
    {
      question: "在 p5.js 中，哪一個函式會在程式開始時執行一次？",
      options: ["draw()", "setup()", "start()", "begin()"],
      answer: 1
    },
    {
      question: "在 p5.js 中，哪一個函式會持續重複執行？",
      options: ["loop()", "repeat()", "draw()", "update()"],
      answer: 2
    },
    {
      question: "下列哪一個指令可以建立畫布？",
      options: [
        "createCanvas(400, 400)",
        "makeCanvas(400, 400)",
        "canvas(400, 400)",
        "newCanvas(400, 400)"
      ],
      answer: 0
    },
    {
      question: "在 p5.js 中，哪一個指令可以設定背景顏色？",
      options: ["fill()", "background()", "color()", "bg()"],
      answer: 1
    },
    {
      question: "下列哪一個指令可以畫出圓形？",
      options: ["circle()", "ellipse()", "round()", "oval()"],
      answer: 1
    }
  ];
  
  // 儲存目前正在作答的題目編號
  let currentQuestion = 0;
  
  // 儲存使用者答對的題數
  let score = 0;
  
  // 儲存使用者目前選擇的選項
  let selectedOption = -1;
  
  // 儲存使用者是否已經作答
  let hasAnswered = false;
  
  // 儲存測驗是否已經完成
  let quizFinished = false;
  
  // 儲存下一題按鈕的位置與大小
  let nextButton = {
    x: 0,
    y: 0,
    width: 180,
    height: 55
  };
  
  // 儲存重新開始按鈕的位置與大小
  let restartButton = {
    x: 0,
    y: 0,
    width: 200,
    height: 55
  };
  
  // 儲存選項的位置與大小
  let optionBoxes = [];
  
  // 設定畫布與文字顯示方式
  function setup() {
    // 建立符合瀏覽器視窗大小的畫布
    createCanvas(windowWidth, windowHeight);
  
    // 設定文字水平置中對齊
    textAlign(CENTER, CENTER);
  
    // 設定使用的文字字型
    textFont("sans-serif");
  
    // 設定畫布像素密度，讓畫面在高解析度螢幕上更清晰
    pixelDensity(1);
  }
  
  // 每一幀重新繪製畫面
  function draw() {
    // 設定淡灰藍色背景
    background("#f5f9fc");
  
    // 判斷測驗是否已經完成
    if (quizFinished) {
      // 顯示測驗結果畫面
      drawResultScreen();
    } else {
      // 顯示測驗題目畫面
      drawQuizScreen();
    }
  }
  
  // 繪製測驗題目畫面
  function drawQuizScreen() {
    // 取得目前題目的資料
    const current = questions[currentQuestion];
  
    // 計算內容區域的最大寬度
    const contentWidth = min(width - 40, 900);
  
    // 設定內容區域的左側位置
    const contentX = (width - contentWidth) / 2;
  
    // 繪製標題
    fill("#1d3557");
    noStroke();
    textSize(min(width * 0.06, 34));
    textStyle(BOLD);
    text("p5.js 簡易指令測驗", width / 2, 45);
  
    // 繪製題數文字
    fill("#457b9d");
    textSize(min(width * 0.04, 20));
    textStyle(NORMAL);
    text(
      `第 ${currentQuestion + 1} 題／共 ${questions.length} 題`,
      width / 2,
      88
    );
  
    // 設定題目區域的高度
    const questionHeight = 120;
  
    // 設定題目區域的垂直位置
    const questionY = 115;
  
    // 繪製題目背景
    fill("#ffffff");
    stroke("#c9d6e2");
    strokeWeight(2);
    rect(contentX, questionY, contentWidth, questionHeight, 16);
  
    // 繪製題目文字
    fill("#1d3557");
    noStroke();
    textSize(min(width * 0.045, 25));
    textStyle(BOLD);
  
    // 取得題目文字換行後的內容
    const questionLines = wrapText(
      current.question,
      contentWidth - 40,
      min(width * 0.045, 25)
    );
  
    // 繪製題目文字
    drawTextLines(questionLines, width / 2, questionY + questionHeight / 2, 32);
  
    // 清空選項位置陣列
    optionBoxes = [];
  
    // 設定選項區域的起始位置
    const optionStartY = questionY + questionHeight + 30;
  
    // 判斷目前是否使用雙欄版面
    const isTwoColumns = width >= 700;
  
    // 設定選項間距
    const gap = 18;
  
    // 計算選項寬度
    const optionWidth = isTwoColumns
      ? (contentWidth - gap) / 2
      : contentWidth;
  
    // 設定選項高度
    const optionHeight = 90;
  
    // 逐一繪製四個選項
    for (let i = 0; i < current.options.length; i++) {
      // 計算目前選項所在的欄位
      const column = isTwoColumns ? i % 2 : 0;
  
      // 計算目前選項所在的列
      const row = isTwoColumns ? floor(i / 2) : i;
  
      // 計算選項的水平位置
      const optionX = contentX + column * (optionWidth + gap);
  
      // 計算選項的垂直位置
      const optionY = optionStartY + row * (optionHeight + gap);
  
      // 儲存目前選項的基本位置
      let displayY = optionY;
  
      // 判斷是否需要讓正確選項上下跳動
      if (
        hasAnswered &&
        selectedOption !== current.answer &&
        i === current.answer
      ) {
        // 使用 sin 函式產生上下跳動效果
        displayY += sin(frameCount * 0.15) * 10;
      }
  
      // 儲存選項的位置與大小
      optionBoxes.push({
        x: optionX,
        y: displayY,
        width: optionWidth,
        height: optionHeight
      });
  
      // 設定選項預設背景顏色
      let optionColor = "#ffffff";
  
      // 判斷是否已經作答且目前選項為正確答案
      if (hasAnswered && i === current.answer) {
        // 將正確選項設定為指定的淡藍色
        optionColor = "#caf0f8";
      }
  
      // 判斷是否已經作答且目前選項為錯誤答案
      if (hasAnswered && i === selectedOption && i !== current.answer) {
        // 將錯誤選項設定為淡紅色
        optionColor = "#ffd6d6";
      }
  
      // 繪製選項背景
      fill(optionColor);
      stroke("#8aa9bd");
      strokeWeight(2);
      rect(optionX, displayY, optionWidth, optionHeight, 14);
  
      // 設定選項文字顏色
      fill("#1d3557");
      noStroke();
      textStyle(NORMAL);
      textSize(min(width * 0.038, 21));
  
      // 取得選項文字換行後的內容
      const optionLines = wrapText(
        `${String.fromCharCode(65 + i)}. ${current.options[i]}`,
        optionWidth - 30,
        min(width * 0.038, 21)
      );
  
      // 繪製選項文字
      drawTextLines(optionLines, optionX + optionWidth / 2, displayY + optionHeight / 2, 28);
    }
  
    // 判斷使用者是否已經作答
    if (hasAnswered) {
      // 設定回饋文字顏色
      fill(selectedOption === current.answer ? "#2a9d8f" : "#e76f51");
  
      // 設定回饋文字大小
      textSize(min(width * 0.04, 22));
  
      // 設定回饋文字粗細
      textStyle(BOLD);
  
      // 顯示答題結果
      if (selectedOption === current.answer) {
        text("答對了！", width / 2, height - 125);
      } else {
        text("答錯了，正確答案已標示。", width / 2, height - 125);
      }
  
      // 設定下一題按鈕位置
      nextButton.x = width / 2 - nextButton.width / 2;
      nextButton.y = height - 95;
  
      // 繪製下一題按鈕
      fill("#457b9d");
      noStroke();
      rect(
        nextButton.x,
        nextButton.y,
        nextButton.width,
        nextButton.height,
        12
      );
  
      // 繪製下一題按鈕文字
      fill("#ffffff");
      textSize(20);
      textStyle(BOLD);
      text("下一題", width / 2, nextButton.y + nextButton.height / 2);
    }
  }
  
  // 繪製測驗完成結果畫面
  function drawResultScreen() {
    // 設定結果畫面的標題顏色
    fill("#1d3557");
  
    // 設定標題文字大小
    textSize(min(width * 0.08, 42));
  
    // 設定標題文字粗細
    textStyle(BOLD);
  
    // 顯示完成文字
    text("測驗完成！", width / 2, height * 0.25);
  
    // 設定分數文字顏色
    fill("#2a9d8f");
  
    // 設定分數文字大小
    textSize(min(width * 0.1, 56));
  
    // 顯示答對題數
    text(`${score}／${questions.length} 題答對`, width / 2, height * 0.43);
  
    // 設定鼓勵文字顏色
    fill("#457b9d");
  
    // 設定鼓勵文字大小
    textSize(min(width * 0.045, 24));
  
    // 判斷分數並顯示不同鼓勵文字
    if (score === questions.length) {
      text("太棒了！全部答對！", width / 2, height * 0.54);
    } else if (score >= 3) {
      text("表現很好，繼續加油！", width / 2, height * 0.54);
    } else {
      text("再練習一次，你一定會更進步！", width / 2, height * 0.54);
    }
  
    // 設定重新開始按鈕的位置
    restartButton.x = width / 2 - restartButton.width / 2;
    restartButton.y = height * 0.65;
  
    // 繪製重新開始按鈕
    fill("#457b9d");
    noStroke();
    rect(
      restartButton.x,
      restartButton.y,
      restartButton.width,
      restartButton.height,
      12
    );
  
    // 繪製重新開始按鈕文字
    fill("#ffffff");
    textSize(20);
    textStyle(BOLD);
    text("重新開始", width / 2, restartButton.y + restartButton.height / 2);
  }
  
  // 處理滑鼠點擊事件
  function mousePressed() {
    // 判斷測驗是否已經完成
    if (quizFinished) {
      // 判斷是否點擊重新開始按鈕
      if (
        pointInRectangle(
          mouseX,
          mouseY,
          restartButton.x,
          restartButton.y,
          restartButton.width,
          restartButton.height
        )
      ) {
        // 重新開始整個測驗
        restartQuiz();
      }
  
      // 結束滑鼠事件
      return;
    }
  
    // 判斷目前是否已經作答
    if (!hasAnswered) {
      // 逐一檢查四個選項
      for (let i = 0; i < optionBoxes.length; i++) {
        // 取得目前選項的位置資料
        const box = optionBoxes[i];
  
        // 判斷滑鼠是否點擊目前選項
        if (
          pointInRectangle(
            mouseX,
            mouseY,
            box.x,
            box.y,
            box.width,
            box.height
          )
        ) {
          // 記錄使用者選擇的選項
          selectedOption = i;
  
          // 設定作答狀態為已作答
          hasAnswered = true;
  
          // 判斷使用者是否答對
          if (selectedOption === questions[currentQuestion].answer) {
            // 答對時增加分數
            score++;
          }
  
          // 結束選項檢查
          break;
        }
      }
    } else {
      // 判斷滑鼠是否點擊下一題按鈕
      if (
        pointInRectangle(
          mouseX,
          mouseY,
          nextButton.x,
          nextButton.y,
          nextButton.width,
          nextButton.height
        )
      ) {
        // 進入下一題
        goToNextQuestion();
      }
    }
  }
  
  // 判斷座標是否位於矩形範圍內
  function pointInRectangle(pointX, pointY, rectangleX, rectangleY, rectangleWidth, rectangleHeight) {
    // 回傳座標是否同時符合水平與垂直範圍
    return (
      pointX >= rectangleX &&
      pointX <= rectangleX + rectangleWidth &&
      pointY >= rectangleY &&
      pointY <= rectangleY + rectangleHeight
    );
  }
  
  // 進入下一題
  function goToNextQuestion() {
    // 判斷目前是否為最後一題
    if (currentQuestion >= questions.length - 1) {
      // 設定測驗完成狀態
      quizFinished = true;
    } else {
      // 題目編號加一
      currentQuestion++;
  
      // 清除上一題的選擇
      selectedOption = -1;
  
      // 設定為尚未作答
      hasAnswered = false;
    }
  }
  
  // 重新開始測驗
  function restartQuiz() {
    // 將目前題目重設為第一題
    currentQuestion = 0;
  
    // 將分數歸零
    score = 0;
  
    // 清除使用者選擇
    selectedOption = -1;
  
    // 設定為尚未作答
    hasAnswered = false;
  
    // 設定測驗尚未完成
    quizFinished = false;
  }
  
  // 讓文字依照指定寬度自動換行
  function wrapText(inputText, maxWidth, fontSize) {
    // 設定目前文字大小
    textSize(fontSize);
  
    // 將文字依照空白切割成單字
    const words = inputText.split(" ");
  
    // 建立空的文字行陣列
    const lines = [];
  
    // 建立目前正在組合的文字
    let currentLine = "";
  
    // 逐一處理每個文字片段
    for (let i = 0; i < words.length; i++) {
      // 取得下一個文字片段
      const testLine = currentLine + words[i];
  
      // 判斷加入下一個文字片段後是否超過寬度
      if (textWidth(testLine) > maxWidth && currentLine !== "") {
        // 將目前文字行存入陣列
        lines.push(currentLine);
  
        // 將目前文字片段作為新的一行
        currentLine = words[i];
      } else {
        // 將文字片段加入目前文字行
        currentLine += words[i];
      }
    }
  
    // 將最後一行文字加入陣列
    if (currentLine !== "") {
      lines.push(currentLine);
    }
  
    // 回傳換行後的文字陣列
    return lines;
  }
  
  // 繪製多行文字
  function drawTextLines(lines, centerX, centerY, lineHeight) {
    // 計算所有文字行的總高度
    const totalHeight = lines.length * lineHeight;
  
    // 計算第一行文字的垂直位置
    const startY = centerY - totalHeight / 2 + lineHeight / 2;
  
    // 逐一繪製每一行文字
    for (let i = 0; i < lines.length; i++) {
      // 繪製目前的文字行
      text(lines[i], centerX, startY + i * lineHeight);
    }
  }
  
  // 當瀏覽器視窗大小改變時重新調整畫布
  function windowResized() {
    // 將畫布調整為最新的視窗大小
    resizeCanvas(windowWidth, windowHeight);
  }

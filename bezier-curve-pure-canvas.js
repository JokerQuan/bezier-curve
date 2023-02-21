class BezierCurvePureCanvas {
  startPoint = null;
  endPoint = null;
  ctlPoint1 = null;
  ctlPoint2 = null;

  _container;
  _ctx = null;
  _canvas = null;

  _pointSize = 16; //px
  _padding = 8;

  constructor(containerSel) {
    this._container = document.querySelector(containerSel);
    this._container.style.position = 'relative';
    this._canvas = document.createElement("canvas");
    this._container.appendChild(this._canvas);
    this._ctx = this._canvas.getContext('2d');
    this._canvas.width = this._container.clientWidth;
    this._canvas.height = this._container.clientHeight;

    this._init();
    this.render();
  }

  _init() {
    this.startPoint = new Point(0, 0);
    this.endPoint = new Point(this._canvas.width, this._canvas.height);
    this.ctlPoint1 = new Point(this._canvas.width * 1/4, this._canvas.height * 3/4);
    this.ctlPoint2 = new Point(this._canvas.width * 3/4, this._canvas.height * 1/4);

    this._bindDrag();
  }

  _bindDrag() {
    // 鼠标按下时，相对圆点中心的偏移量
    let downPointOffsetX = 0;
    let downPointOffsetY = 0;

    let dragPoint = null;
    const moveFn = (moveEvent) => {
      let canvasX = moveEvent.pageX - this._container.offsetLeft - downPointOffsetX;
      let canvasY = moveEvent.pageY - this._container.offsetTop - downPointOffsetY;

      // 处理边界
      if (canvasX < 0) canvasX = 0;
      if (canvasX > this._canvas.width) canvasX = this._canvas.width;
      if (canvasY < 0) canvasY = 0;
      if (canvasY > this._canvas.height) canvasY = this._canvas.height;
      
      dragPoint.x = canvasX;
      dragPoint.y = this._canvas.height - canvasY;

      // 更新
      this.render();
    };

    this._canvas.addEventListener('mousedown', (e) => {
      dragPoint = this._pointInWitchCircle(e.offsetX, e.offsetY);

      if (!dragPoint) return;
      
      downPointOffsetX = e.offsetX - dragPoint.x;
      downPointOffsetY = e.offsetY - (this._canvas.height - dragPoint.y);

      document.addEventListener('mousemove', moveFn);
      document.addEventListener('mouseup', (e) => {
        document.removeEventListener('mousemove', moveFn);
      });
    });

    // 鼠标样式
    document.addEventListener('mousemove', (e) => {
      const mouseP = this._pointInWitchCircle(e.offsetX, e.offsetY);
      if (mouseP) {
        this._container.style.cursor = 'move';
      } else {
        this._container.style.cursor = 'default';
      }
    });
  }

  // 判断点是否在圆内，在则返回所在圆的圆心点，否则返回 undefined
  _pointInWitchCircle(x, y) {
    const { startPoint, endPoint, ctlPoint1, ctlPoint2, _pointSize, _canvas } = this;
    // 优先级应该与绘制顺序相反
    return [ctlPoint2, ctlPoint1, endPoint, startPoint].find(cp => {
      return Math.sqrt((x - cp.x) * (x - cp.x) + (y - (_canvas.height - cp.y)) * (y - (_canvas.height - cp.y))) <= _pointSize / 2;
    });
  }

  _drawBackground() {
    this._ctx.beginPath();
    let height = 20;
    const count = Math.ceil(this._canvas.height / height);
    for (let i = 0; i <= count; i++) {
      if (i % 2 === 0) {
        this._ctx.fillStyle = "white";
      } else {
        this._ctx.fillStyle = "rgba(200, 200, 200, .3)";
      }
      let y = this._canvas.height - height * i;
      
      if (i === count) {
        height = this._canvas.height - (height * (i - 1));
      }
      this._ctx.fillRect(0, y, this._canvas.width, height);
    }
    this._ctx.closePath();
  }

  _drawBorder() {
    this._ctx.beginPath();
    this._ctx.lineWidth = 1;
    this._ctx.strokeStyle = "rgba(0, 0, 0, .9)";
    this._ctx.strokeRect(0, 0, this._canvas.width, this._canvas.height);
    this._ctx.closePath();
  }

  _drawLine() {
    const { startPoint, endPoint, ctlPoint1, ctlPoint2, _canvas, _ctx } = this;
    // 起点、终点直线
    _ctx.lineWidth = 6;
    _ctx.strokeStyle = "rgba(200, 200, 200, .6)";
    _ctx.beginPath();
    _ctx.moveTo(startPoint.x, _canvas.height - startPoint.y);
    _ctx.lineTo(endPoint.x, _canvas.height - endPoint.y);
    _ctx.stroke();
    _ctx.closePath();
    
    // 辅助线
    _ctx.lineWidth = 1;
    _ctx.strokeStyle = "rgba(0, 0, 0, .9)";
    _ctx.beginPath();
    _ctx.moveTo(startPoint.x, _canvas.height - startPoint.y);
    _ctx.lineTo(ctlPoint1.x, _canvas.height - ctlPoint1.y);
    _ctx.moveTo(endPoint.x, _canvas.height - endPoint.y);
    _ctx.lineTo(ctlPoint2.x, _canvas.height - ctlPoint2.y);
    _ctx.stroke();
    _ctx.closePath();
    
    // 曲线
    _ctx.lineWidth = 6;
    _ctx.strokeStyle = "black";
    _ctx.beginPath();
    _ctx.moveTo(startPoint.x, _canvas.height - startPoint.y);
    _ctx.bezierCurveTo(
      ctlPoint1.x, _canvas.height - ctlPoint1.y, 
      ctlPoint2.x, _canvas.height - ctlPoint2.y, 
      endPoint.x, _canvas.height - endPoint.y
    );
    _ctx.stroke();
    _ctx.closePath();
  }

  _drawPoint(p, color) {
    const { _canvas, _ctx, _pointSize } = this;
    _ctx.beginPath();
    _ctx.arc(p.x, _canvas.height - p.y, _pointSize / 2, 0, 2 * Math.PI);
    _ctx.fillStyle = color;
    _ctx.fill()
    _ctx.lineWidth = 1;
    _ctx.strokeStyle = "black";
    _ctx.stroke();
    _ctx.closePath();
  }

  render() {
    const { startPoint, endPoint, ctlPoint1, ctlPoint2 } = this;
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._drawBackground();
    this._drawBorder();
    this._drawLine();
    this._drawPoint(startPoint, 'white');
    this._drawPoint(endPoint, 'white');
    this._drawPoint(ctlPoint1, 'red');
    this._drawPoint(ctlPoint2, 'blue');
  }
}
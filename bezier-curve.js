class Point {
  x;
  y;
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class BezierCurve {
  startPoint = null;
  endPoint = null;
  ctlPoint1 = null;
  ctlPoint2 = null;

  _container;
  _ctx = null;
  _canvas = null;

  _pointSize = 16; //px

  constructor(containerSel) {
    this._container = document.querySelector(containerSel);
    this._container.style.position = 'relative';
    this._canvas = document.createElement("canvas");
    this._container.appendChild(this._canvas);
    this._ctx = this._canvas.getContext('2d');
    this._canvas.width = container.clientWidth;
    this._canvas.height = container.clientHeight;

    this._init();
    this.render();
  }

  _init() {
    this.startPoint = new Point(0, 0);
    this.endPoint = new Point(this._canvas.width, this._canvas.height);
    this.ctlPoint1 = new Point(this._canvas.width * 1/4, this._canvas.height * 3/4);
    this.ctlPoint2 = new Point(this._canvas.width * 3/4, this._canvas.height * 1/4);

    this._createDragPointer(this.startPoint, 'white');
    this._createDragPointer(this.endPoint, 'white');
    this._createDragPointer(this.ctlPoint1, 'red');
    this._createDragPointer(this.ctlPoint2, 'blue');
  }

  _createDragPointer(p, color) {
    const dragBtn = document.createElement('button');
    dragBtn.style.cssText = `
      position: absolute;
      width: ${this._pointSize}px;
      height: ${this._pointSize}px;
      left: ${p.x - this._pointSize / 2}px;
      top: ${this._canvas.height - p.y - this._pointSize / 2}px;
      background-color: ${color};
      border: 1px solid black;
      border-radius: 50%;
      box-sizing: border-box;
      cursor: move;
    `;
    this._bindDrag(dragBtn, p);
    this._container.appendChild(dragBtn);
  }

  _movePointer(dragBtn, p) {
    dragBtn.style.left = `${p.x - this._pointSize / 2}px`;
    dragBtn.style.top = `${this._canvas.height - p.y - this._pointSize / 2}px`;
  }

  _bindDrag(dragBtn, p) {
    // 鼠标按下时，选中圆点在数学坐标系中的位置
    const downPoint = new Point(-1, -1);
    // 鼠标按下时，相对圆点中心的偏移量
    let downPointOffsetX = 0;
    let downPointOffsetY = 0;
    const moveFn = (moveEvent) => {
      let canvasX = moveEvent.clientX - this._container.offsetLeft - downPointOffsetX;
      let canvasY = moveEvent.clientY - this._container.offsetTop - downPointOffsetY;

      // 处理边界
      if (canvasX < 0) canvasX = 0;
      if (canvasX > this._canvas.width) canvasX = this._canvas.width;
      if (canvasY < 0) canvasY = 0;
      if (canvasY > this._canvas.height) canvasY = this._canvas.height;
      
      p.x = canvasX;
      p.y = this._canvas.height - canvasY;
      
      this._movePointer(dragBtn, p);

      // 更新
      this.render();
    };

    dragBtn.addEventListener('mousedown', (e) => {
      // 加 1 是因为圆点的边框宽度不算在offsetX里
      downPoint.x = e.clientX - (e.offsetX + 1) + this._pointSize / 2;
      downPoint.y = e.clientY - (e.offsetY + 1) + this._pointSize / 2;
      
      downPointOffsetX = e.offsetX + 1 - this._pointSize / 2;
      downPointOffsetY = e.offsetY + 1 - this._pointSize / 2;

      document.addEventListener('mousemove', moveFn);
    });
    document.addEventListener('mouseup', (e) => {
      document.removeEventListener('mousemove', moveFn);
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

  render() {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._drawBackground();
    this._drawBorder();
    this._drawLine();
  }
}
class BezierCurveNoDrag {
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

  updateStart(x, y) {
    this.startPoint.x = x;
    this.startPoint.y = this._canvas.height - y;
    this.render();
  }

  updateEnd(x, y) {
    this.endPoint.x = x;
    this.endPoint.y = this._canvas.height - y;
    this.render();
  }

  updateC1(x, y) {
    this.ctlPoint1.x = x;
    this.ctlPoint1.y = this._canvas.height - y;
    this.render();
  }

  updateC2(x, y) {
    this.ctlPoint2.x = x;
    this.ctlPoint2.y = this._canvas.height - y;
    this.render();
  }

  render() {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._drawBackground();
    this._drawBorder();
    this._drawLine();
  }
}
class Drag {
  constructor(ele, container) {
    this._container = container;
    this._bindDrag(ele)
  }

  _bindDrag(ele) {
    // 鼠标按下时，拖拽元素的偏移量
    let downPointOffsetX = 0;
    let downPointOffsetY = 0;
    const moveFn = (moveEvent) => {
      let containerX = moveEvent.pageX - this._container.offsetLeft - downPointOffsetX;
      let containerY = moveEvent.pageY - this._container.offsetTop - downPointOffsetY;
      console.log(moveEvent);

      // 处理边界
      if (containerX < 0) containerX = 0;
      if (containerX > this._container.clientWidth) containerX = this._container.clientWidth;
      if (containerY < 0) containerY = 0;
      if (containerY > this._container.clientHeight) containerY = this._container.clientHeight;
      
      ele.style.left = `${containerX - ele.clientWidth / 2}px`;
      ele.style.top = `${containerY - ele.clientHeight / 2}px`;

      this.onMove(containerX, containerY);
    };

    ele.addEventListener('mousedown', (e) => {
      // 加 1 是因为圆点的边框宽度不算在offsetX里
      downPointOffsetX = e.offsetX + 1 - ele.clientWidth / 2;
      downPointOffsetY = e.offsetY + 1 - ele.clientWidth / 2;

      document.addEventListener('mousemove', moveFn);
      document.addEventListener('mouseup', (e) => {
        document.removeEventListener('mousemove', moveFn);
      });
    });
  }
}
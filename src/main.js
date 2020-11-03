class TilCarousel {
  constructor(selector, threshold = 50) {
    try {
      this.container = document.getElementById(selector);
    } catch (e) {
      console.log(selector + " Not Found Element");
    }

    this.threshold = threshold;

    this.wrapper = this.container.children[0];
    this.items = [].slice.call(this.wrapper.children);
    this.count = this.items.length;

    // create initial container object
    this.container.width = this.container.offsetWidth;

    // current position
    this.current = 0;

    // Bind all event handler
    this.resizeHandler = this.resizeHandler.bind(this);
    this.touchstartHandler = this.touchstartHandler.bind(this);
    this.touchendHandler = this.touchendHandler.bind(this);
    this.touchmoveHandler = this.touchmoveHandler.bind(this);

    this.init();
  }

  init() {
    this.attachEvents();

    this.container.style.overflow = "hidden";

    this.buildFrame();

    // Browser Support
    this.transformProperty =
      typeof document.documentElement.style.transform === "string"
        ? "transform"
        : "WebkitTransform";

    this.container.style.visibility = "visible";
  }

  buildFrame() {
    // Create frame and apply styling
    this.wrapper.style.width = this.count * this.container.width + "px";
    this.slide();
  }

  attachEvents() {
    this.pressing = false;

    this.drag = {
      startX: 0,
      endX: 0,
    };

    window.addEventListener("resize", this.resizeHandler);

    this.container.addEventListener("touchstart", this.touchstartHandler);
    this.container.addEventListener("touchend", this.touchendHandler);
    this.container.addEventListener("touchmove", this.touchmoveHandler);
  }

  /**
   * Handlers
   *
   */
  resizeHandler() {
    this.container.width = this.container.offsetWidth;
    this.animate(0);
    this.buildFrame();
  }

  touchstartHandler(e) {
    e.stopPropagation();

    this.touching = true;
    this.animate(0);

    // touching start point
    this.drag.startX = e.touches[0].pageX;
  }

  touchendHandler(e) {
    e.stopPropagation();

    this.touching = false;

    var movement = this.drag.endX - this.drag.startX;

    if (movement > this.threshold) {
      this.prev();
    } else if (movement < -this.threshold) {
      this.next();
    } else {
      this.slide();
    }
  }

  touchmoveHandler(e) {
    e.stopPropagation();

    if (this.touching) {
      e.preventDefault();

      this.drag.endX = e.touches[0].pageX;
      var currentOffset = this.current * this.container.width;
      var dragOffset = this.drag.endX - this.drag.startX;
      this.transform(dragOffset - currentOffset);
    }
  }

  /**
   * public methods
   *
   */
  slide() {
    var offset = this.container.width * this.current * -1;

    this.transform(offset);
    this.animate(200);
  }
  goTo(index) {
    this.current = index;
    this.slide();
  }

  prev() {
    if (this.current > 0) {
      this.current--;
    }

    this.slide();
  }

  next() {
    if (this.current < this.count - 1) {
      this.current++;
    }

    this.slide();
  }

  /**
   * Utils
   *
   */
  transform(value) {
    this.wrapper.style[this.transformProperty] =
      "translate3d(" + value + "px, 0, 0)";
  }

  animate(duration = 0) {
    this.wrapper.style.transition =
      "transform" + (" " + duration + "ms ") + "ease-out";
  }
}

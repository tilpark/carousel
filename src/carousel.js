class TilCarousel {
  constructor(selector) {
    try {
      this.container = document.getElementById(selector);
      this.wrapper = this.container.children[0];
      this.items = [].slice.call(this.wrapper.children);

      // count of wrapper in items
      this.count = this.items.length;

      // create initial container object
      this.container.width = this.container.offsetWidth;

      // current position
      this.current = 0;

      // threshold
      this.threshold = this.container.width / 5;

      // Bind all event handler
      this.resizeHandler = this.resizeHandler.bind(this);
      this.touchstartHandler = this.touchstartHandler.bind(this);
      this.touchendHandler = this.touchendHandler.bind(this);
      this.touchmoveHandler = this.touchmoveHandler.bind(this);

      this.init();
    } catch (e) {
      console.log(
        "There is a problem with the structure or the " +
          selector +
          " could not be found"
      );
    }
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
    this.slide(false);
  }

  attachEvents() {
    this.pressing = false;

    this.drag = {
      startX: 0,
      endX: 0,
    };

    window.addEventListener("resize", this.resizeHandler);

    this.wrapper.addEventListener("touchstart", this.touchstartHandler);
    this.wrapper.addEventListener("touchend", this.touchendHandler);
    this.wrapper.addEventListener("touchmove", this.touchmoveHandler);
  }

  /**
   * Handlers
   *
   */
  resizeHandler() {
    this.container.width = this.container.offsetWidth;
    this.threshold = this.container.width / 5;

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

    var movement = this.drag.endX ? this.drag.endX - this.drag.startX : 0;

    if (movement > this.threshold) {
      this.prev();
    } else if (movement < -this.threshold) {
      this.next();
    } else {
      this.slide();
    }

    // clear drag values
    this.drag = {
      startX: 0,
      endX: 0,
    };
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
  slide(animate = true) {
    if (animate) {
      if (typeof this.onChange === "function") {
        this.onChange(this.current);
      }
    }

    var offset = this.container.width * this.current * -1;

    this.transform(offset);
    this.animate(animate ? 200 : 0);
  }

  goTo(index) {
    if (index > -1 && index < this.count) {
      this.current = index;
      this.slide();
    }
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
    this.wrapper.style.webkitTransition =
      "transform" + (" " + duration + "ms ") + "ease-out";
  }
}


# carousel
Lightweight VanillaJs mobile carousel

## Usage

### JavaScript
```js
var carousel = new TilCarousel("carousel");

// methods
carousel.next();
carousel.prev();
carousel.goTo(index);
```

### HTML
```html
<div id="carousel" class="til-carousel">
  <div class="wrapper">
    <div class="item"></div>
    <div class="item"></div>
    <div class="item"></div>
    <div class="item"></div>
  </div>
</div>
```

### CSS
```css
.til-carousel {
	 visibility: hidden;    
}

.til-carousel .wrapper .item {
	float: left;
	 width: 100vw;
	 height: 100vh;
}
```

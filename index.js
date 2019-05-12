class TimelineProgressBar {
  constructor({
    sections,
    sectionSize,
    barSize,
    ballSize,
    paddingTop,
    paddingBottom,
    marginRight,
    barBorder,
    barShadow,
    barTransition,
    ballBorder,
    ballShadow,
    ballTransition,
  } = {}) {
    // Globals
    this.activeSection = 0;
    this.wrapperId = 'timeline-progress-bar';
    this.borderId = 'timeline-progress-bar-border';
    this.shadowId = 'timeline-progress-bar-shadow';
    this.ballId = 'timeline-progress-bar-ball';
    this.HTML = {
      [this.wrapperId]: {},
      [this.borderId]: null,
      [this.shadowId]: null,
    };

    // Sizes
    this.sections = sections || 2;
    this.sectionSize = sectionSize || 2.5;
    this.barSize = barSize || 1;
    this.ballSize = ballSize || this.sectionSize - 0.5;

    // Positioning
    this.paddingTop = paddingTop || 4;
    this.paddingBottom = paddingBottom || 4;
    this.marginRight = marginRight || 2;
    this.hideRight = this.marginRight + this.sectionSize * 2;

    // Styling
    this.barBorder = barBorder || '';
    this.barShadow = barShadow || '';
    this.barTransition = barTransition || 'margin-right 0.25s';
    this.ballBorder = ballBorder || '';
    this.ballShadow = ballShadow || '';
    this.ballTransition = ballTransition || 'margin-top 0.25s';

    this.createHtml(this.wrapperId);
    this.initializeCss(this.wrapperId);
    this.createBallHtmlAndCss();

    if (barBorder) {
      this.createHtml(this.borderId);
      this.initializeCss(this.borderId);
      this.addBorderCss();
    }

    if (barShadow) {
      this.createHtml(this.shadowId);
      this.initializeCss(this.shadowId);
      this.addShadowCss();
    }
  }

  /**
   * Creates the HTML elements, appends to body and saves the jQuery elements:
   * wrapper, sections, section bars
   */
  createHtml(id) {
    const $wrapper = $(`<div id="${id}"></div>`);
    const sectionHtml = `<div class="${id}__section"></div>`;
    const sectionBarHtml = `<div class="${id}__section-bar"></div>`;

    for (var i = 0; i < this.sections; i++) {
      $wrapper.append(sectionHtml);

      if (i < this.sections - 1) {
        $wrapper.append(sectionBarHtml);
      }
    }

    $('body').prepend($wrapper);
    this.HTML[id] = {
      $wrapper: $(`#${id}`),
      $sections: $(`.${id}__section`),
      $sectionBars: $(`.${id}__section-bar`),
    };
  }

  /**
   * Initializes all the CSS, and once done, makes the bar visible.
   * This is done to avoid flickering.
   */
  initializeCss(id) {
    this.HTML[id].$wrapper.css({
      zIndex: 300,
      position: 'fixed',
      right: `${this.marginRight}rem`,
      top: 0,
      height: '100vh',
      visibility: 'hidden',
      paddingTop: `${this.paddingTop}rem`,
      paddingBottom: `${this.paddingBottom}rem`,
      marginRight: 0,
      transition: this.barTransition,
    });

    let emptySpace = this.paddingTop + this.paddingBottom + this.sectionSize;
    this.HTML[id].$sectionBars.css({
      zIndex: 301,
      position: 'relative',
      height: `calc((100vh - ${emptySpace}rem) / ${this.sections - 1} )`,
      width: `${this.barSize}rem`,
      margin: '0 auto',
      marginTop: `-${this.sectionSize / 2}rem`,
      marginBottom: `-${this.sectionSize / 2}rem`,
      background: 'white',
    });

    this.HTML[id].$sections.css({
      zIndex: 302,
      position: 'relative',
      height: `${this.sectionSize}rem`,
      width: `${this.sectionSize}rem`,
      borderRadius: `${this.sectionSize}rem`,
      background: 'white',
    });

    this.HTML[id].$wrapper.css({ visibility: 'visible' });
  }

  /**
   * Adds the CSS for the border
   */
  addBorderCss() {
    const borderRegex = this.barBorder.match(/(\d+|.\d+|\d+.\d+)(px|rem)/);
    const borderSize = borderRegex ? borderRegex[1] : 3;
    const borderUnit = borderRegex ? borderRegex[2] : 'px';

    this.HTML[this.borderId].$sections.css({
      border: this.barBorder,
      margin: `-${borderSize}${borderUnit}`,
      background: 'none',
    });
    this.HTML[this.borderId].$sectionBars.css({
      border: this.barBorder,
      marginTop: `calc(-${this.sectionSize / 2}rem - ${borderSize * 2}${borderUnit})`,
      marginBottom: `calc(-${this.sectionSize / 2}rem - ${borderSize * 2}${borderUnit})`,
    });
  }

  /**
   * Adds the CSS for the shadow
   */
  addShadowCss() {
    this.HTML[this.shadowId].$sections.css({ boxShadow: this.barShadow });
    this.HTML[this.shadowId].$sectionBars.css({ boxShadow: this.barShadow });
  }

  /**
   * Creates the HTML for the ball and initializes its CSS.
   */
  createBallHtmlAndCss() {
    const borderRegex = this.ballBorder.match(/(\d+|.\d+|\d+.\d+)(px|rem)/);
    const borderSize = borderRegex ? borderRegex[1] : 3;
    const borderUnit = borderRegex ? borderRegex[2] : 'px';
    const border = borderSize + borderUnit;
    const halfBorder = borderSize / 2 + borderUnit;

    this.HTML[this.wrapperId].$wrapper.append(`<div id="${this.ballId}"></div>`);
    this.HTML[this.wrapperId].$ball = $(`#${this.ballId}`);

    let height = `${this.ballSize}rem`;
    let width = `${this.ballSize}rem`;
    let top = `${this.paddingTop + (this.sectionSize - this.ballSize) / 2}rem`;
    let right = `${(this.sectionSize - this.ballSize) / 2}rem`;

    if (this.ballBorder) {
      height = `calc(${this.ballSize}rem - ${border})`;
      width = `calc(${this.ballSize}rem - ${border})`;
      top = `calc(${this.paddingTop + (this.sectionSize - this.ballSize) / 2}rem - ${halfBorder})`;
      right = `calc(${(this.sectionSize - this.ballSize) / 2}rem - ${halfBorder})`;
    }

    this.HTML[this.wrapperId].$ball.css({
      zIndex: 305,
      position: 'absolute',
      top,
      right,
      height,
      width,
      borderRadius: `${this.ballSize}rem`,
      transition: this.ballTransition,
      border: this.ballBorder,
      boxShadow: this.ballShadow,
      background: 'purple',
    });
  }

  /**
   * Hides the bar.
   */
  hide() {
    if (this.HTML[this.shadowId])
      this.HTML[this.shadowId].$wrapper.css({ marginRight: `-${this.hideRight}rem` });
    if (this.HTML[this.borderId])
      this.HTML[this.borderId].$wrapper.css({ marginRight: `-${this.hideRight}rem` });
    this.HTML[this.wrapperId].$wrapper.css({ marginRight: `-${this.hideRight}rem` });
  }

  /**
   * Shows the bar.
   */
  show() {
    if (this.HTML[this.shadowId]) this.HTML[this.shadowId].$wrapper.css({ marginRight: 0 });
    if (this.HTML[this.borderId]) this.HTML[this.borderId].$wrapper.css({ marginRight: 0 });
    this.HTML[this.wrapperId].$wrapper.css({ marginRight: 0 });
  }

  /**
   * Moves to the next section.
   */
  next() {
    if (this.activeSection >= this.sections - 1) return;
    this.activeSection++;
    this.moveBall();
  }

  /**
   * Moves to the previous section.
   */
  previous() {
    if (this.activeSection <= 0) return;
    this.activeSection--;
    this.moveBall();
  }

  /**
   * Moves to a specific section.
   */
  moveTo(sectionId) {
    if (sectionId < 0 || sectionId >= this.sections) return;
    this.activeSection = sectionId;
    this.moveBall();
  }

  /**
   * Moves the ball to the active section.
   */
  moveBall() {
    const emptySpace = this.paddingTop + this.paddingBottom + this.sectionSize;
    const sectionId = this.activeSection;
    this.HTML[this.wrapperId].$ball.css({
      marginTop: `calc(((100vh - ${emptySpace}rem) / ${this.sections - 1} ) * ${sectionId})`,
    });
  }
}

const init = () => {
  // TODO: Make clicking call "moveTo" and also pass in a function that takes element and index
  // TODO: Make disabling a section possible
  // TODO: Allow for different CSS to be passed to disabled sections
  // TODO: Allow pass in effects for mouse-over balls

  progressBar = new TimelineProgressBar({
    sections: 3,
    marginRight: 5,
    barBorder: '2px solid red',
    barShadow: '0px 0px 10px 10px rgba(0,255,0,0.95)',
    barTransition: 'margin-right ease-in 0.25s',
    ballBorder: '2px solid black',
    ballShadow: '0px 0px 3px 3px rgba(255,0,0,0.95)',
  });
};

let progressBar;
window.onload = init;

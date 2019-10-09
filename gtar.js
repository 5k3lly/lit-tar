import { css, html, LitElement } from 'lit-element';
import * as m from './lib/music.js';

class LitGuitar extends LitElement {
  static get styles() {
    return css`
    @import url('https://fonts.googleapis.com/css?family=Roboto&display=swap&subset=latin-ext');
    :host {
      display: block
    }
    * {
      box-sizing: border-box;
    }
    div { display: inline-block }
    div.guitar {
      display: inline-flex;
      font-family: 'Roboto', sans-serif;
      background-image: url('fretboard.jpeg');
    }
    div.guitar.vertical {
      flex-direction: column;
    }

    div.fret:nth-child(1) {
      background-color: white;
    }
    div.fret {
      display: block;
    }
    div.guitar.vertical div.fret {
      display: flex;
      flex-direction: row-reverse;
      border-bottom: 4px solid silver;
    }

    div.note-container {
      display: block;
      margin: 0;
    }
    div.guitar.horizontal div.note-container {
      border-right: 4px solid silver;
    }

    div.note {
      font-weight: bold;
      color: white;
      margin: 8px;
      height: 24px;
      width: 24px;
      border-radius: 50%;
      text-align: center;
    }

    div.guitar.vertical div.fret:nth-child(1) {
      border-bottom: 0;
    }
    div.fret:nth-child(1) div.note {
      border-radius: 0;
    }
    div.fret:nth-child(1) div.note-container {
      border-right: 0;
      background: #000;
    }
    `;
  }

  static get properties() {
    return {
      frets: { type: Number },

      // Array of strings, defaults to ['E','A','B','G','E']
	    tuning: { type: Array },

      // root note for intervals.
      key: { type: String },

      // keys are 2-character interval code,
      // values are valid CSS background-color's.
      intervalColouring: { type: Object },

      // note numbers 0-12 to light up.
      highlight: { type: Array },

      // 'horizontal' or 'vertical'
      orientation: { type: String },

      // fret spacing (default f(x)=1)
      fretSpacing: { type: Function },


      // spits out an easy to render guitar.
      _guitar: { type: Function }
    }
  }

  constructor() { super() }

   _guitar() {
    this.frets = this.frets || 15;
    this.tuning = this.tuning || ['E','A','D','G','B','E'];
    this.key = this.key || 'C';
    this.orientation = this.orientation || 'horizontal';
    // some debate on how best to colour them...
    this.intervalColouring = this.intervalColouring || {
      'P1': '#4286f4', 'm2': '#8c8c8c', 'M2': '#606060', 'm3': '#a5a12e',
      'M3': '#642ea5', 'P4': '#a53e2e', 'TT': '#000000', 'P5': '#1e6d1a',
      'm6': '#8c8c8c', 'M6': '#606060', 'm6': '#a5a12e', 'M7': '#606060'
    }

    let o = [];
    for (let fret = 0; fret <= this.frets; fret++) {
      o[fret] = [];

      this.tuning.slice().reverse().map(note => {
        // numeric note 0-12.
        let n = (m.numb[note] + fret) % 12;
        o[fret].push({
          letter: m.alfa[n],
          // subtract to get the new root.
          // if i don't add 12, it says -2 mod 12 = -2 .. wtf?
          colour: this.highlight ?
            this.highlight.includes( (12+n - m.numb[this.key]) % 12) ?
            this.intervalColouring[m.intervals[(12+n - m.numb[this.key])%12]] :
            null : null
        })
      });
    }
    return o;
  }

 render() {
    console.log("[lit-tar] render");
    return html`
    <div class='guitar ${this.orientation}'>

    ${this._guitar().map((frets,fretNum) => html`
      <div class='fret'>${frets.map(note => html`
        <div class='note-container'>
          <div class='note' style='background-color:${
            note.colour ? note.colour : "none"}'>

            ${note.letter}
          </div>`)}
        </div>`)}
    </div>`;
  }
}
customElements.define('lit-tar', LitGuitar);

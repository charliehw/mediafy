/**
 * @file Lightweight abstration for HTML5 canvas and video elements
 * @author charliehw
 */

/**
 * @namespace mediafy
 */
window.mediafy = window.mediafy || {};

(function (mediafy) {
    
    'use strict';

    /**
     * Creates a representation of a media element. Superclass for mediafy.Canvas and mediafy.Video
     * @constructor
     * @param {(string|number)} - Selector for video element or width of video to be created
     * @param {number=} - Optional number for height of video to be created
     */
    mediafy.MediaObject = function () {
        if (typeof arguments[0] === 'string') {
            this._elem = document.querySelector(arguments[0]);
        } else {
            this._elem = document.createElement(this._type);
            if (typeof arguments[0] === 'number' && typeof arguments[1] === 'number') {
                this._elem.width = arguments[0];
                this._elem.height = arguments[1];
            }
            document.body.appendChild(this._elem);
        }
    };

    mediafy.MediaObject.prototype = {
        /**
         * Reference to constructor
         * @memberof mediafy.MediaObject#
         */
        constructor: mediafy.MediaObject,

        /**
         * Remove the element from the DOM
         * @memberof mediafy.MediaObject#
         * @returns {mediafy.MediaObject}
         */
        remove: function () {
            this._elem.parentNode.removeChild(this.elem);
            return this;
        },

        /**
         * Toggle class hide on the element
         * @memberof mediafy.MediaObject#
         * @returns {mediafy.MediaObject}
         */
        toggleVisibility: function () {
            this._elem.classList.toggle('hide');
            return this;
        },

        /**
         * Returns the value of an attribute of the element, or the element itself
         * @memberof mediafy.MediaObject#
         * @param {string=} attr - Attribute to be retrieved, or empty
         * @returns {*}
         */
        get: function (attr) {
            if (attr && this._elem[attr]) {
                return this._elem[attr];
            }
            return this._elem;
        },

        /**
         * Sets the value of an attribute on the element
         * @memberof mediafy.MediaObject#
         * @param {string} attr - Attribute to be set
         * @param {*} value - Value to set
         * @returns {mediafy.MediaObject}
         */
        set: function (attr, value) {
            this._elem[attr] = value;
            return this;
        }
    };


    /**
     * Collection of utility methods
     * @namespace mediafy.util
     */
    mediafy.util = {
        /**
         * Extend an object with another object
         * @memberof mediafy.util
         * @param {Object} target - Object to be extended
         * @param {Object} other - Object to extend with
         * @returns {Object}
         */
        extend: function (target, other) {
            target = target || {};
            other = other || {};
            for (var name in other) {
                if (other.hasOwnProperty(name)) {
                    target[name] = other[name];
                }
            }
            return target;
        }
    };
    navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);


    /**
     * Creates a representation of an HTML5 video with utility methods
     * @constructor
     * @param {(string|number)} - Selector for video element or width of video to be created
     * @param {number=} - Optional number for height of video to be created
     */
    mediafy.Video = function () {
        this._type = 'video';
        mediafy.MediaObject.apply(this, Array.prototype.slice.call(arguments, 0));
    };

    mediafy.Video.prototype = Object.create(mediafy.MediaObject.prototype);

    mediafy.Video.prototype = mediafy.util.extend(mediafy.Video.prototype, {
        /**
         * Reference to constructor
         * @memberof mediafy.Video#
         */
        constructor: mediafy.Video,

        /**
         * Load video data from device camera to the video element
         * @memberof mediafy.Video#
         * @param {requestCallback} onLoaded - Called once the user media has loaded into the video element.
         * @returns {mediafy.Video}
         */
        loadUserMedia: function (onLoaded) {
            var self = this;
            navigator.getMedia({video: true}, function (localMediaStream) {
                self._elem.src = window.URL.createObjectURL(localMediaStream);
                self._elem.onloadedmetadata = onLoaded;
            });
            return this;
        },

        /**
         * Play the video
         * @memberof mediafy.Video#
         * @returns {mediafy.Video}
         */
        play: function () {
            this._elem.play();
            return this;
        },

        /**
         * Pause the video
         * @memberof mediafy.Video#
         * @returns {mediafy.Video}
         */
        pause: function () {
            this._elem.pause();
            return this;
        }
    });



    /**
     * Creates a representation of an HTML5 canvas with utility methods
     * @constructor
     * @param {(string|number)} - Selector for canvas element or width of canvas to be created
     * @param {number=} - Optional number for height of canvas to be created
     */
    mediafy.Canvas = function () {
        this._type = 'canvas';
        mediafy.MediaObject.apply(this, Array.prototype.slice.call(arguments, 0));
    };

    mediafy.Canvas.prototype = Object.create(mediafy.MediaObject.prototype);

    mediafy.Canvas.prototype = mediafy.util.extend(mediafy.Canvas.prototype, {
        /**
         * Reference to constructor
         * @memberof mediafy.Canvas#
         */
        constructor: mediafy.Canvas,

        /**
         * Clears the entire canvas or a rectangle matching the coords passed in
         * @memberof mediafy.Canvas#
         * @param {mediafy.Coords=} coords - Optional coords object to clear
         * @returns {mediafy.Canvas}
         */
        clear: function (coords) {
            coords = coords || new mediafy.Coords(this);
            this.getContext().clearRect(coords.x, coords.y, coords.width, coords.height);
            return this;
        },

        /**
         * Get the image data from the canvas, see {@link https://developer.mozilla.org/en-US/docs/Web/API/ImageData}
         * @memberof mediafy.Canvas#
         * @param {mediafy.Coords=} coords - Optional coords object to get image data from
         * @returns {ImageData}
         */
        getImageData: function (coords) {
            coords = coords || new mediafy.Coords(this);
            return this.getContext().getImageData(coords.x, coords.y, coords.width, coords.height);
        },

        /**
         * Put an image onto the full size of the canvas, or in the area represented by the coords passed in
         * @memberof mediafy.Canvas#
         * @param {nsIDOMElement|mediafy.MediaObject} image - Any image element, see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D#drawImage()}
         * @param {mediafy.Coords=} coords - Optional coords object to place the image on
         * @returns {mediafy.Canvas}
         */
        putImage: function (image, coords) {
            coords = coords || new mediafy.Coords(this);
            if (image instanceof mediafy.MediaObject) {
                image = image.get();
            }
            this.getContext().drawImage(image, coords.x, coords.y, coords.width, coords.height);
            return this;
        },

        /**
         * Get a rendering context for the canvas
         * @memberof mediafy.Canvas#
         * @param {string=} type - Typically '2d' or 'webgl', defaults to '2d'
         * @returns {RenderingContext}
         */
        getContext: function (type) {
            if (!this._context || type) {
                this._context = this._elem.getContext(type || '2d');
            }
            return this._context;
        },

        /**
         * Export image from canvas to new window
         * @memberof mediafy.Canvas#
         */
        exportImage: function () {
            window.open(this._elem.toDataURL('image/png'));
        }
    });


    /**
     * Creates a representation of coordinates for a rectangle area
     * @constructor
     * @param {mediafy.MediaObject|Object.<string, number>} data - Instance of MediaObject to represent full size, or an object including x, y, widht and height
     */
    mediafy.Coords = function (data) {
        if (data instanceof mediafy.MediaObject) {
            this.x = 0;
            this.y = 0;
            this.width = data.get('width');
            this.height = data.get('height');
        } else {
            this.x = data.x;
            this.y = data.y;
            this.width = data.width;
            this.height = data.height;
        }
    };

    mediafy.Coords.prototype = {
        /**
         * Reference to constructor
         * @memberof mediafy.Coords#
         */
        constructor: mediafy.Coords,

        /**
         * Move the representation horizontally and/or vertically
         * @memberof mediafy.Coords#
         * @param {number[]} tuple - [Movement in x, Movement in y] these values can be negative
         * @returns {mediafy.Coords}
         */
        translate: function (tuple) {
            this.x += tuple[0];
            this.y += tuple[1];
            return this;
        },

        /**
         * Scale the width and height by a factor
         * @memberof mediafy.Coords#
         * @param {number} factor - Factor to scale the width and height. Must be positive
         * @returns {mediafy.Coords}
         */
        scale: function (factor) {
            this.width *= factor;
            this.height *= factor;
            return this;
        }
    };

}(window.mediafy));
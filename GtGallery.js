/**
 * Created by giladtakoni on 20/07/2016.
 */

/**
 *
 * @name GtGallery
 * @class
 * @desc
 * @version 1.0.0
 * @author Gilad takoni <gilad1987@gmail.com>
 * @param {Element} container
 * @param {Number} intervalTimeout
 * @constructor
 */
function GtGallery(container, intervalTimeout){

    if(!container){
        throw new Error('GtGallery: Invalid element pass to constructor');
    }

    var init = false;
    var CLASS_NAME_ITEM = "GtGallery__item";
    var CLASS_NAME_ITEM_BUTTON = "GtGallery__index_button";
    var items = container.getElementsByClassName(CLASS_NAME_ITEM);
    var itemsLength = items.length-1;
    var currentIndex = 0;
    var currentElement = null;
    var interval = null;

    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    /**
     * @desc Set index
     * @param {Number} [index]
     * @returns {number}
     */
    function setCurrent(index){
        currentIndex = typeof items[index] == 'undefined' ? 0 : index;
        return currentIndex;
    }

    /**
     * @desc Update view with current index remove class from current element
     *       1. remove class from element as current.
     *       2. update height container with current item.
     *       3. add class to current item.
     */
    function updateView(){
        var nextElement = items[currentIndex];
        if(currentElement!=null){
            currentElement.classList.remove('current');
        }
        container.style.height = nextElement.clientHeight+"px";
        nextElement.classList.add('current');
        currentElement = nextElement;
    }

    /**
     * @desc Update current index and update view
     * @param {Number} [index]
     */
    function setItem(index){

        index = isNumeric(index) ? index : ((currentIndex+1) <= itemsLength ? currentIndex+1 : 0);
        setCurrent(index);
        updateView();
    }

    /**
     * @desc
     * @returns {boolean}
     */
    function creteButtons(){
        if(init) return false;

        var i=0,
            button,buttons,
            buttonClass = "fa fa-circle "+CLASS_NAME_ITEM_BUTTON;

        buttons = document.createElement('div');
        buttons.className = 'buttons';

        for(; i<=itemsLength; i++ ){
            button = document.createElement('i');
            button.className = buttonClass;
            button.dataset['itemIndex'] = i;
            buttons.appendChild(button);
        }

        button = document.createElement('i');
        button.className = 'fa fa-pause-circle stop';
        buttons.appendChild(button);

        button = document.createElement('i');
        button.className = 'fa fa-play-circle-o play';
        buttons.appendChild(button);


        container.appendChild(buttons);
    }

    /**
     * @desc Attache click event to buttons control
     * @returns {boolean}
     */
    function attachEvent(){
        if(init) return false;

        function onClick(event){
            var target = event.target,
                index;

            if(target.classList.contains('play')){
                if(interval==null){
                    play(true,null);
                }
                return false;
            }

            if(target.classList.contains('stop')){
                stop();
                return false;
            }

            if(!target.classList.contains(CLASS_NAME_ITEM_BUTTON)){
                return false;
            }

            index = target.dataset['itemIndex'];
            if(index==currentIndex){
                return;
            }
            play(true, index);
        }

        container.addEventListener("click",onClick);
    }

    /**
     * @desc 1. call stop function
     *       2. if pass next set next item (if pass index set index)
     *       3. set new interval
     *
     * @param {Boolean} [next]
     * @param {Number} [index]
     * @param {Boolean} [preventPlayIfAlreadyPlay]
     */
    function play(next, index, preventPlayIfAlreadyPlay){

        if(preventPlayIfAlreadyPlay && interval!=null){
            return;
        }

        stop();

        if(next)
            setItem(index);

        interval = setInterval(function(){
            setItem();
        },intervalTimeout);
    }

    /**
     * @desc Clear interval
     */
    function stop(){
        if(interval){
            clearInterval(interval);
        }

        interval = null;
    }

    /**
     * @desc Init the gallery
     * @returns {boolean}
     */
    this.init = function init(){
        if(init==true) {
            return false;
        }

        creteButtons();
        attachEvent();
        play(true,currentIndex);
        init=true;
    };


    /**
     * @desc API
     * @type {play}
     */
    this.play = play;

    /**
     * @desc API
     * @type {stop}
     */
    this.stop = stop;
}

function onLoad(){
    var container = document.getElementById('about-the-film');
    var gallery = new GtGallery(container,3000);
    gallery.init();

}
document.addEventListener('DOMContentLoaded',onLoad);

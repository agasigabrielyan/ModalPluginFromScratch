class Modally {
    constructor( config ) {
        this.animations = ['fade-up', 'fade-down'];
        this.config = config;
        this.defaultOptions = {
            blur: true,
            centered: true,
            animation: this.animations[0]
        };
        this.triggerDataAttLabel = 'data-modally-trigger';
        this.closerDataAttLabel = 'data-modally-close';
        this.modalDataAttLabel = 'data-modally-id';

        if( typeof config === 'object' ) {
            this.options = {...this.defaultOptions, ...config}
        }

        this.init(
            this.setupTriggers
        );
    }

    // call a function init function and inside that init function
    // this is a chanse to initialize any starting functions which we'd like to be initialized
    // and if plugin base grows we will add more and more functions into it
    init() {
        this.setupTriggers();
        this.setupClosers();
        this.setupModalClasses();
    }


    //setup triggers
    setupTriggers() {
        const triggers = document.querySelectorAll(`[${this.triggerDataAttLabel}]`);
        if( triggers.length>0 ) {
            triggers.forEach((trigger) => {
                trigger.addEventListener('click',(event) => {
                    event.preventDefault();
                    this.openModal( { modalId: event.target.getAttribute(`${this.triggerDataAttLabel}`) } );
                });
            });
        }
    }

    // setup closers
    setupClosers() {

    }


    // setup modal classes
    setupModalClasses() {
        const modals = document.querySelectorAll(`[${this.modalDataAttLabel}]`);
        if( modal.length > 0 ) {
            modals.forEach( (modal) => {
                modal.classList.add( ...this.calculateModalClasses());
            } );
        }
    }

    // calculate modal classes
    calculateModalClasses() {
        const cssClasses = [];

        if( this.options.centered ) {
            cssClasses.push('modal-centered');
        }

        if( this.options.blur ) {
            cssClasses.push('modal-blur');
        }

        if( this.isValidAnimation(this.options.animations ) ) {
            cssClasses.push(this.options.animation);
        } else {
            cssClasses.push(this.animations[0]);
        }

        return cssClasses;
    }

    isValidAnimation( animation ) {
        return this.animations.includes(animation);
    }

    // open modal function
    openModal( {modalID} ) {
        const modal = document.querySelector(`[${this.modalDataAttLabel}=${modalID}]`);
        modal.classList.add(this.showModalCSS);

        this.handleCustomEvent({
            type: 'before_open',
            modal
        });
        this.handleCustomEvent({
            type: 'after_open',
            modal
        })
    }


    // close modal
    closeModal() {
        const modals = document.querySelectorAll(`[${this.modalDataAttLabel}]`);
        const closeBtns = document.querySelectorAll(`[${this.closerDataAttLabel}]`);
        if( modals.length > 0 ) {
            modals.forEach((modal) => {
                modal.querySelector('modally-backdrop').addEventListener('click', (e) => {
                    this.closeModal({ modalID: e.target.getAttribute(`${this.modalDataAttLabel}`)});
                });
            });
        }
        if( closeBtns.length > 0 ) {
            closeBtns.forEach((btn) => {
                btn.addEventListener('click', (event) => {
                    event.preventDefault();
                    this.closeModal({
                        modalID: event.target.getAttribute(`${this.closeDataAttLabel}`)
                    });
                });
            });
        }

        this.handleCustomEvent({type: 'after_close', modal})
    }

    // bubles true означает, что все родительские эелменты нашего элемента, так же слушают наше событие
    // handle our custom events
    handleCustomEvent({ type, modal }) {
        const event = new CustomEvent(
            type,
            {
                bubbles: true,
                detail: modal,
            }
        );
        modal.dispatchEvent(event);
    }
}


'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">@disane/ngx-taskboard documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="changelog.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CHANGELOG
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/NgxTaskboardModule.html" data-type="entity-link">NgxTaskboardModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-NgxTaskboardModule-f5a3016c516b3c04876fb98acaac2ad2"' : 'data-target="#xs-components-links-module-NgxTaskboardModule-f5a3016c516b3c04876fb98acaac2ad2"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-NgxTaskboardModule-f5a3016c516b3c04876fb98acaac2ad2"' :
                                            'id="xs-components-links-module-NgxTaskboardModule-f5a3016c516b3c04876fb98acaac2ad2"' }>
                                            <li class="link">
                                                <a href="components/BoardComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BoardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FilterSearchBarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FilterSearchBarComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-NgxTaskboardModule-f5a3016c516b3c04876fb98acaac2ad2"' : 'data-target="#xs-injectables-links-module-NgxTaskboardModule-f5a3016c516b3c04876fb98acaac2ad2"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-NgxTaskboardModule-f5a3016c516b3c04876fb98acaac2ad2"' :
                                        'id="xs-injectables-links-module-NgxTaskboardModule-f5a3016c516b3c04876fb98acaac2ad2"' }>
                                        <li class="link">
                                            <a href="injectables/TaskboardService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>TaskboardService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/TaskboardService.html" data-type="entity-link">TaskboardService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/CardItem.html" data-type="entity-link">CardItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ClickEvent.html" data-type="entity-link">ClickEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CollapseEvent.html" data-type="entity-link">CollapseEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CollapseState.html" data-type="entity-link">CollapseState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DropEvent.html" data-type="entity-link">DropEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GroupHeading.html" data-type="entity-link">GroupHeading</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GroupKeys.html" data-type="entity-link">GroupKeys</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Scrollable.html" data-type="entity-link">Scrollable</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ScrollEvent.html" data-type="entity-link">ScrollEvent</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});
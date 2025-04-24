// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item affix "><li class="spacer"></li><li class="chapter-item affix "><a href="introduction.html">Welcome</a></li><li class="chapter-item affix "><li class="spacer"></li><li class="chapter-item affix "><li class="part-title">The Linera Protocol</li><li class="chapter-item "><a href="protocol/overview.html">Overview</a></li><li class="chapter-item "><a href="protocol/use_cases.html">Use cases</a></li><li class="chapter-item "><a href="protocol/roadmap.html">Roadmap</a></li><li class="chapter-item affix "><li class="spacer"></li><li class="chapter-item affix "><li class="part-title">Developers</li><li class="chapter-item "><a href="developers/getting_started.html">Getting Started</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="developers/getting_started/installation.html">Installation</a></li><li class="chapter-item "><a href="developers/getting_started/hello_linera.html">Hello, Linera</a></li></ol></li><li class="chapter-item "><a href="developers/core_concepts.html">Core Concepts</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="developers/core_concepts/microchains.html">Microchains</a></li><li class="chapter-item "><a href="developers/core_concepts/wallets.html">Wallets</a></li><li class="chapter-item "><a href="developers/core_concepts/node_service.html">Node Service</a></li><li class="chapter-item "><a href="developers/core_concepts/applications.html">Applications</a></li></ol></li><li class="chapter-item "><a href="developers/backend.html">Writing Backends</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="developers/backend/creating_a_project.html">Creating a Project</a></li><li class="chapter-item "><a href="developers/backend/state.html">Creating the Application State</a></li><li class="chapter-item "><a href="developers/backend/abi.html">Defining the ABI</a></li><li class="chapter-item "><a href="developers/backend/contract.html">Writing the Contract Binary</a></li><li class="chapter-item "><a href="developers/backend/service.html">Writing the Service Binary</a></li><li class="chapter-item "><a href="developers/backend/deploy.html">Deploying the Application</a></li><li class="chapter-item "><a href="developers/backend/messages.html">Cross-Chain Messages</a></li><li class="chapter-item "><a href="developers/backend/composition.html">Calling other Applications</a></li><li class="chapter-item "><a href="developers/backend/blobs.html">Using Data Blobs</a></li><li class="chapter-item "><a href="developers/backend/logging.html">Printing Logs from an Application</a></li><li class="chapter-item "><a href="developers/backend/testing.html">Writing Tests</a></li></ol></li><li class="chapter-item "><a href="developers/frontend.html">Writing Frontends</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="developers/frontend/overview.html">Overview</a></li><li class="chapter-item "><a href="developers/frontend/setup.html">Setup</a></li><li class="chapter-item "><a href="developers/frontend/interactivity.html">Interactivity</a></li></ol></li><li class="chapter-item "><a href="developers/advanced_topics.html">Advanced Topics</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="developers/advanced_topics/contract_finalize.html">Contract Finalization</a></li><li class="chapter-item "><a href="developers/advanced_topics/validators.html">Validators</a></li><li class="chapter-item "><a href="developers/advanced_topics/block_creation.html">Creating New Blocks</a></li><li class="chapter-item "><a href="developers/advanced_topics/assets.html">Applications that Handle Assets</a></li></ol></li><li class="chapter-item "><a href="developers/experimental.html">Experimental</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="developers/experimental/ml.html">Machine Learning</a></li></ol></li><li class="chapter-item "><li class="spacer"></li><li class="chapter-item affix "><li class="part-title">Node Operators</li><li class="chapter-item "><a href="operators/devnets.html">Devnets</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="operators/devnets/compose.html">Docker Compose</a></li><li class="chapter-item "><a href="operators/devnets/kind.html">kind</a></li></ol></li><li class="chapter-item "><a href="operators/testnets.html">Testnets</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="operators/testnets/requirements.html">Requirements</a></li><li class="chapter-item "><a href="operators/testnets/one-click.html">One-Click Deploy</a></li><li class="chapter-item "><a href="operators/testnets/manual-installation.html">Manual Installation</a></li><li class="chapter-item "><a href="operators/testnets/verify-installation.html">Verifying your Installation</a></li><li class="chapter-item "><a href="operators/testnets/monitoring-logging.html">Monitoring and Logging</a></li><li class="chapter-item "><a href="operators/testnets/debugging.html">Debugging</a></li></ol></li><li class="chapter-item "><li class="spacer"></li><li class="chapter-item "><a href="appendix/glossary.html">Glossary</a></li><li class="chapter-item "><a href="appendix/videos.html">Videos</a></li><li class="chapter-item affix "><li class="spacer"></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);

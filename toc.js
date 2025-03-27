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
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="introduction.html">The Linera Manual</a></li><li class="chapter-item expanded "><a href="developers.html"><strong aria-hidden="true">1.</strong> Developers</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="developers/getting_started.html"><strong aria-hidden="true">1.1.</strong> Getting Started</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="developers/getting_started/installation.html"><strong aria-hidden="true">1.1.1.</strong> Installation</a></li><li class="chapter-item expanded "><a href="developers/getting_started/hello_linera.html"><strong aria-hidden="true">1.1.2.</strong> Hello, Linera</a></li></ol></li><li class="chapter-item expanded "><a href="developers/core_concepts.html"><strong aria-hidden="true">1.2.</strong> The Linera Protocol</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="developers/core_concepts/overview.html"><strong aria-hidden="true">1.2.1.</strong> Overview</a></li><li class="chapter-item expanded "><a href="developers/core_concepts/microchains.html"><strong aria-hidden="true">1.2.2.</strong> Microchains</a></li><li class="chapter-item expanded "><a href="developers/core_concepts/wallets.html"><strong aria-hidden="true">1.2.3.</strong> Wallets</a></li><li class="chapter-item expanded "><a href="developers/core_concepts/node_service.html"><strong aria-hidden="true">1.2.4.</strong> Node Service</a></li><li class="chapter-item expanded "><a href="developers/core_concepts/applications.html"><strong aria-hidden="true">1.2.5.</strong> Applications</a></li></ol></li><li class="chapter-item expanded "><a href="developers/sdk.html"><strong aria-hidden="true">1.3.</strong> Writing Linera Applications</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="developers/sdk/creating_a_project.html"><strong aria-hidden="true">1.3.1.</strong> Creating a Project</a></li><li class="chapter-item expanded "><a href="developers/sdk/state.html"><strong aria-hidden="true">1.3.2.</strong> Creating the Application State</a></li><li class="chapter-item expanded "><a href="developers/sdk/abi.html"><strong aria-hidden="true">1.3.3.</strong> Defining the ABI</a></li><li class="chapter-item expanded "><a href="developers/sdk/contract.html"><strong aria-hidden="true">1.3.4.</strong> Writing the Contract Binary</a></li><li class="chapter-item expanded "><a href="developers/sdk/service.html"><strong aria-hidden="true">1.3.5.</strong> Writing the Service Binary</a></li><li class="chapter-item expanded "><a href="developers/sdk/deploy.html"><strong aria-hidden="true">1.3.6.</strong> Deploying the Application</a></li><li class="chapter-item expanded "><a href="developers/sdk/messages.html"><strong aria-hidden="true">1.3.7.</strong> Cross-Chain Messages</a></li><li class="chapter-item expanded "><a href="developers/sdk/composition.html"><strong aria-hidden="true">1.3.8.</strong> Calling other Applications</a></li><li class="chapter-item expanded "><a href="developers/sdk/blobs.html"><strong aria-hidden="true">1.3.9.</strong> Using Data Blobs</a></li><li class="chapter-item expanded "><a href="developers/sdk/logging.html"><strong aria-hidden="true">1.3.10.</strong> Printing Logs from an Application</a></li><li class="chapter-item expanded "><a href="developers/sdk/testing.html"><strong aria-hidden="true">1.3.11.</strong> Writing Tests</a></li></ol></li><li class="chapter-item expanded "><a href="developers/advanced_topics.html"><strong aria-hidden="true">1.4.</strong> Advanced Topics</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="developers/advanced_topics/contract_finalize.html"><strong aria-hidden="true">1.4.1.</strong> Contract Finalization</a></li><li class="chapter-item expanded "><a href="developers/advanced_topics/validators.html"><strong aria-hidden="true">1.4.2.</strong> Validators</a></li><li class="chapter-item expanded "><a href="developers/advanced_topics/block_creation.html"><strong aria-hidden="true">1.4.3.</strong> Creating New Blocks</a></li><li class="chapter-item expanded "><a href="developers/advanced_topics/assets.html"><strong aria-hidden="true">1.4.4.</strong> Applications that Handle Assets</a></li></ol></li><li class="chapter-item expanded "><a href="developers/experimental.html"><strong aria-hidden="true">1.5.</strong> Experimental</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="developers/experimental/ml.html"><strong aria-hidden="true">1.5.1.</strong> Machine Learning</a></li></ol></li></ol></li><li class="chapter-item expanded "><a href="operators.html"><strong aria-hidden="true">2.</strong> Node Operators</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="operators/devnets.html"><strong aria-hidden="true">2.1.</strong> Devnets</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="operators/devnets/compose.html"><strong aria-hidden="true">2.1.1.</strong> Docker Compose</a></li><li class="chapter-item expanded "><a href="operators/devnets/kind.html"><strong aria-hidden="true">2.1.2.</strong> kind</a></li></ol></li><li class="chapter-item expanded "><a href="operators/testnets.html"><strong aria-hidden="true">2.2.</strong> Testnets</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="operators/testnets/joining.html"><strong aria-hidden="true">2.2.1.</strong> Joining a Testnet</a></li></ol></li></ol></li><li class="chapter-item expanded "><a href="appendix.html"><strong aria-hidden="true">3.</strong> Appendix</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="appendix/glossary.html"><strong aria-hidden="true">3.1.</strong> Glossary</a></li><li class="chapter-item expanded "><a href="appendix/videos.html"><strong aria-hidden="true">3.2.</strong> Videos</a></li></ol></li></ol>';
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

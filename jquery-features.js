/**
 * Cozy Cafe — jQuery Features Module
 * ====================================
 * Demonstrates standard jQuery functionalities layered on top of the existing
 * vanilla JavaScript application.
 *
 * jQuery Concepts Demonstrated:
 *  1.  Selectors & DOM Manipulation   — $(), .find(), .parent(), .siblings(), .closest()
 *  2.  Event Handling                 — .on(), .hover(), .click(), .scroll(), event delegation
 *  3.  Effects & Animations           — .fadeIn(), .fadeOut(), .slideDown(), .slideUp(), .slideToggle(), .animate()
 *  4.  AJAX                           — $.ajax() simulated newsletter subscription
 *  5.  Chaining                       — Multi-step method chaining on elements
 *  6.  Utility Methods                — $.each(), $.map(), $.grep(), $.trim(), $.isNumeric()
 *  7.  Attribute Manipulation         — .attr(), .prop(), .data(), .val(), .removeAttr()
 *  8.  CSS Manipulation               — .css(), .addClass(), .removeClass(), .toggleClass(), .hasClass()
 *  9.  Content Manipulation           — .html(), .text(), .append(), .prepend(), .after(), .before(), .empty(), .remove()
 * 10.  DOM Traversal                  — .find(), .parent(), .children(), .siblings(), .closest(), .next(), .prev()
 */

// ── jQuery Document Ready ─────────────────────────────────────────────────────
$(document).ready(function () {
    'use strict';

    // ╔════════════════════════════════════════════════════════════════════════╗
    // ║  9. CONTENT MANIPULATION — Dynamic Promo Banner (.prepend, .html)    ║
    // ╚════════════════════════════════════════════════════════════════════════╝

    const promoBannerHTML = `
        <div id="jq-promo-banner" class="jq-promo-banner" style="display:none;">
            <div class="jq-promo-inner">
                <i class="fas fa-gift"></i>
                <span class="jq-promo-text">🎉 Welcome Offer! Use code <strong>COZY20</strong> for 20% off your first order!</span>
                <button id="jq-promo-dismiss" class="jq-promo-close" title="Dismiss">&times;</button>
            </div>
        </div>`;

    // .prepend() — Insert promo banner at the very top of the body
    $('body').prepend(promoBannerHTML);

    // Add a continuous news ticker at the very top (above the promo banner)
    const tickerHTML = `
        <div class="jq-ticker-wrap">
            <div class="jq-ticker">
                <div class="jq-ticker-item"><i class="fas fa-bullhorn"></i> New: Try our seasonal Mango Lassi!</div>
                <div class="jq-ticker-item"><i class="fas fa-percent"></i> Get 10% off on all online orders for a limited time.</div>
                <div class="jq-ticker-item"><i class="fas fa-clock"></i> We are now open till 10 PM on weekends.</div>
                <div class="jq-ticker-item"><i class="fas fa-star"></i> Join our loyalty program to earn free Chai.</div>
            </div>
        </div>
    `;
    $('body').prepend(tickerHTML);

    // 3. EFFECTS — slideDown the promo banner
    // Check if user has dismissed it before (7. ATTRIBUTE — .data() + localStorage)
    if (!localStorage.getItem('cozyCafePromoDismissed')) {
        $('#jq-promo-banner').slideDown(600);
    }

    // 2. EVENT — .on('click') to dismiss promo banner
    // 3. EFFECTS — .slideUp() with callback
    $('#jq-promo-dismiss').on('click', function () {
        // 10. DOM TRAVERSAL — .closest() to find the banner container
        $(this).closest('#jq-promo-banner').slideUp(400, function () {
            // 9. CONTENT — .remove() the banner from DOM after animation
            $(this).remove();
        });
        localStorage.setItem('cozyCafePromoDismissed', 'true');
    });


    // ╔════════════════════════════════════════════════════════════════════════╗
    // ║  1. SELECTORS & DOM MANIPULATION — Navbar Scroll Effect             ║
    // ║  8. CSS MANIPULATION — .css(), .addClass(), .removeClass()          ║
    // ╚════════════════════════════════════════════════════════════════════════╝

    const $navbar = $('.navbar');
    const scrollThreshold = 100;

    // 2. EVENT — .scroll() for navbar effect
    $(window).on('scroll', function () {
        // 8. CSS — .toggleClass() based on scroll position
        if ($(window).scrollTop() > scrollThreshold) {
            $navbar.addClass('jq-navbar-scrolled');
        } else {
            $navbar.removeClass('jq-navbar-scrolled');
        }

        // Back-to-top button visibility
        if ($(window).scrollTop() > 400) {
            // 3. EFFECTS — .fadeIn()
            $('#jq-back-to-top').fadeIn(300);
        } else {
            // 3. EFFECTS — .fadeOut()
            $('#jq-back-to-top').fadeOut(300);
        }
    });


    // ╔════════════════════════════════════════════════════════════════════════╗
    // ║  10. DOM TRAVERSAL — Active Nav Link Highlighting                   ║
    // ║  1. SELECTORS — $() with attribute selectors                        ║
    // ╚════════════════════════════════════════════════════════════════════════╝

    (function highlightActiveNav() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        // 1. SELECTORS — attribute contains selector
        // 10. DOM TRAVERSAL — .find() to locate links within nav
        $navbar.find('.nav-link, .btn').each(function () {
            const $link = $(this);
            const href = $link.attr('href') || '';

            // 8. CSS — .addClass()
            if (href === currentPage) {
                $link.addClass('jq-active-link');
                // 10. DOM TRAVERSAL — .siblings() to remove active from others
                $link.parent().siblings().find('.nav-link').removeClass('jq-active-link');
            }
        });
    })();


    // ╔════════════════════════════════════════════════════════════════════════╗
    // ║  9. CONTENT — Back to Top Button (.append)                          ║
    // ║  2. EVENT — .click() with .animate() smooth scroll                  ║
    // ╚════════════════════════════════════════════════════════════════════════╝

    // 9. CONTENT — .append() a back-to-top button to the body
    $('body').append(`
        <button id="jq-back-to-top" class="jq-back-to-top" title="Back to Top" style="display:none;">
            <i class="fas fa-chevron-up"></i>
        </button>
    `);

    // 2. EVENT — .on('click') + 8. CSS — .animate() for smooth scroll
    $('#jq-back-to-top').on('click', function () {
        // .animate() — smooth scroll to top
        $('html, body').animate({ scrollTop: 0 }, 600, 'swing');
    });


    // ╔════════════════════════════════════════════════════════════════════════╗
    // ║  2. EVENT — .hover() on Cards + 5. CHAINING                         ║
    // ║  8. CSS — .css() for dynamic styling                                ║
    // ╚════════════════════════════════════════════════════════════════════════╝

    // 2. EVENT — .hover() with enter/leave handlers
    // 5. CHAINING — multiple methods chained together
    $(document).on('mouseenter', '.card', function () {
        $(this)
            .stop(true)                                          // Stop any running animation
            .css('cursor', 'pointer')                            // 8. CSS — .css()
            .find('.card-img')                                   // 10. DOM TRAVERSAL — .find()
            .stop(true)
            .animate({ opacity: 0.85 }, 200);                   // 3. EFFECTS — .animate()
    }).on('mouseleave', '.card', function () {
        // 5. CHAINING — chain find + animate
        $(this)
            .find('.card-img')
            .stop(true)
            .animate({ opacity: 1 }, 200);
    });


    // ╔════════════════════════════════════════════════════════════════════════╗
    // ║  2. EVENT — Delegated Event Handling (Event Delegation)              ║
    // ║  7. ATTRIBUTE — .data() for storing custom data                     ║
    // ╚════════════════════════════════════════════════════════════════════════╝

    // Event delegation for dynamically created "Add to Cart" buttons
    $(document).on('click', '.btn-add-cart', function () {
        const $btn = $(this);
        const itemName = $btn.data('id');  // 7. ATTRIBUTE — .data()

        // 5. CHAINING — Visual feedback with chaining
        $btn
            .addClass('jq-btn-pulse')
            .prop('disabled', true)                             // 7. ATTRIBUTE — .prop()
            .html('<i class="fas fa-check"></i> Added!')         // 9. CONTENT — .html()
            .delay(1000)
            .queue(function (next) {
                $(this)
                    .removeClass('jq-btn-pulse')
                    .prop('disabled', false)
                    .html('<i class="fas fa-cart-plus"></i> Add to Cart');
                next();
            });
    });


    // ╔════════════════════════════════════════════════════════════════════════╗
    // ║  PAGE-SPECIFIC: HOME PAGE                                           ║
    // ╚════════════════════════════════════════════════════════════════════════╝

    if ($('#hero-section').length) {
        initHomePageJQuery();
    }

    function initHomePageJQuery() {

        // ── 3. EFFECTS — Staggered fadeIn on page load ────────────────────────
        // Hide sections first, then fade them in with delay
        $('[data-animate]').each(function (index) {
            const $section = $(this);
            // 3. EFFECTS — .delay() + .fadeIn() with stagger
            $section
                .css({ opacity: 0, display: 'block' })
                .delay(index * 200)
                .animate({ opacity: 1 }, 800);
        });


        // ── 6. UTILITY — $.each() for stats counter data ─────────────────────

        const statsData = [
            { icon: 'fa-mug-hot', value: 5000, suffix: '+', label: 'Cups of Chai Served' },
            { icon: 'fa-utensils', value: 13, suffix: '', label: 'Handcrafted Items' },
            { icon: 'fa-smile', value: 2500, suffix: '+', label: 'Happy Customers' },
            { icon: 'fa-star', value: 4.8, suffix: '/5', label: 'Average Rating' }
        ];

        // 6. UTILITY — $.each() to build stats HTML
        let statsHTML = '';
        $.each(statsData, function (index, stat) {
            statsHTML += `
                <div class="jq-stat-item">
                    <i class="fas ${stat.icon} jq-stat-icon"></i>
                    <span class="jq-stat-value" data-target="${stat.value}" data-suffix="${stat.suffix}">0${stat.suffix}</span>
                    <span class="jq-stat-label">${stat.label}</span>
                </div>`;
        });

        // 9. CONTENT — .html() to populate the stats section
        $('#jq-stats-grid').html(statsHTML);


        // ── 8. CSS — .animate() Counters on scroll into view ──────────────────

        let statsAnimated = false;

        $(window).on('scroll.statsCounter', function () {
            const $statsSection = $('#jq-stats-section');
            if (!$statsSection.length || statsAnimated) return;

            const sectionTop = $statsSection.offset().top;
            const windowBottom = $(window).scrollTop() + $(window).height();

            if (windowBottom > sectionTop + 100) {
                statsAnimated = true;

                // 1. SELECTORS — class selector to find all stat values
                $('.jq-stat-value').each(function () {
                    const $this = $(this);
                    const target = parseFloat($this.data('target'));   // 7. ATTRIBUTE — .data()
                    const suffix = $this.data('suffix') || '';
                    const isDecimal = target % 1 !== 0;

                    // 8. CSS — .animate() with step callback for counting
                    $({ counter: 0 }).animate({ counter: target }, {
                        duration: 2000,
                        easing: 'swing',
                        step: function (now) {
                            $this.text((isDecimal ? now.toFixed(1) : Math.floor(now)) + suffix);
                        },
                        complete: function () {
                            $this.text((isDecimal ? target.toFixed(1) : target) + suffix);
                        }
                    });
                });
            }
        });


        // ── 4. AJAX — Newsletter Subscription (Simulated) ─────────────────────

        // 2. EVENT — .on('submit') for newsletter form
        $('#jq-newsletter-form').on('submit', function (e) {
            e.preventDefault();

            const $form = $(this);
            const $input = $form.find('#jq-newsletter-email');        // 10. DOM TRAVERSAL — .find()
            const $btn = $form.find('.jq-newsletter-btn');
            const $message = $('#jq-newsletter-message');
            const email = $.trim($input.val());                       // 6. UTILITY — $.trim()

            // Validation using 6. UTILITY — $.trim()
            if (!email || email.indexOf('@') === -1) {
                $message
                    .html('<i class="fas fa-exclamation-circle"></i> Please enter a valid email address')
                    .css('color', '#dc3545')                          // 8. CSS — .css()
                    .fadeIn(300);                                      // 3. EFFECTS — .fadeIn()
                // 5. CHAINING — shake animation
                $input.addClass('jq-shake').on('animationend', function () {
                    $(this).removeClass('jq-shake');
                });
                return;
            }

            // 7. ATTRIBUTE — .prop() to disable button
            $btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> Subscribing...');
            $message.fadeOut(200);

            // 4. AJAX — simulated AJAX call with $.ajax()
            $.ajax({
                url: 'https://jsonplaceholder.typicode.com/posts',    // Fake endpoint
                method: 'POST',
                data: JSON.stringify({ email: email, source: 'cozycafe-newsletter' }),
                contentType: 'application/json',
                // Simulate network delay
                beforeSend: function () {
                    $form.addClass('jq-loading');
                },
                success: function (response) {
                    // Simulate success after delay
                    setTimeout(function () {
                        $form.removeClass('jq-loading');
                        $btn.prop('disabled', false).html('<i class="fas fa-paper-plane"></i> Subscribe');

                        // 9. CONTENT — .html() to show success message
                        $message
                            .html('<i class="fas fa-check-circle"></i> Thank you! You\'re now subscribed to our newsletter.')
                            .css('color', '#4CAF50')
                            .hide()
                            .fadeIn(500);

                        // 7. ATTRIBUTE — .val() to clear the input
                        $input.val('');

                        // Store subscription (7. ATTRIBUTE — .data())
                        $form.data('subscribed', true);
                    }, 1500);
                },
                error: function () {
                    $form.removeClass('jq-loading');
                    $btn.prop('disabled', false).html('<i class="fas fa-paper-plane"></i> Subscribe');
                    $message
                        .html('<i class="fas fa-exclamation-triangle"></i> Oops! Something went wrong. Please try again.')
                        .css('color', '#dc3545')
                        .hide()
                        .fadeIn(500);
                }
            });
        });


        // ── 6. UTILITY — $.grep() and $.map() for testimonial filtering ───────

        // Build "filter by rating" type concept using utility methods
        const testimonialData = [
            { name: 'Priya Sharma', text: 'The Masala Chai here reminds me of home.', rating: 5 },
            { name: 'Rahul Verma', text: 'Their Vada Pav is authentic and spicy.', rating: 4 },
            { name: 'Ananya Gupta', text: 'A hidden gem! The Bun Maska and Chai combo.', rating: 5 }
        ];

        // 6. UTILITY — $.grep() to filter 5-star reviews
        const fiveStarReviews = $.grep(testimonialData, function (review) {
            return review.rating === 5;
        });

        // 6. UTILITY — $.map() to extract just the names
        const fiveStarNames = $.map(fiveStarReviews, function (review) {
            return review.name;
        });

        // Log for demonstration (visible in dev console)
        console.log('[jQuery $.grep()] 5-star reviewers:', fiveStarNames);
        console.log('[jQuery $.map()] Total 5-star reviews:', fiveStarReviews.length);


        // ── 3. EFFECTS — .slideToggle() on About Section ──────────────────────

        // Make the "Our Story" section collapsible
        const $aboutSection = $('#about');
        if ($aboutSection.length) {
            const $aboutContent = $aboutSection.find('p');
            const $aboutTitle = $aboutSection.find('h2');

            // 9. CONTENT — .after() to add toggle indicator
            $aboutTitle.after('<span class="jq-toggle-hint">(click to toggle)</span>');

            // 8. CSS — .css() to make title clickable
            $aboutTitle.css('cursor', 'pointer');

            // 2. EVENT — .on('click') with 3. EFFECTS — .slideToggle()
            $aboutTitle.on('click', function () {
                $aboutContent.slideToggle(400);
                // 8. CSS — .toggleClass()
                $(this).toggleClass('jq-collapsed');
            });
        }
    }


    // ╔════════════════════════════════════════════════════════════════════════╗
    // ║  PAGE-SPECIFIC: MENU PAGE                                           ║
    // ╚════════════════════════════════════════════════════════════════════════╝

    if ($('#menu-container').length && !$('#hero-section').length) {
        initMenuPageJQuery();
    }

    function initMenuPageJQuery() {

        // ── 5. CHAINING — Staggered card entrance animation ───────────────────

        // Use a MutationObserver to detect when vanilla JS renders cards
        const menuContainer = document.getElementById('menu-container');

        const observer = new MutationObserver(function () {
            // 1. SELECTORS — :visible pseudo-class
            $('#menu-container .card').each(function (index) {
                const $card = $(this);

                if (!$card.hasClass('jq-animated')) {
                    // 5. CHAINING — chain hide, delay, fadeIn, addClass
                    $card
                        .css({ opacity: 0, transform: 'translateY(20px)' })
                        .addClass('jq-animated')
                        .delay(index * 80)
                        .animate({ opacity: 1 }, 400)
                        .css('transform', 'translateY(0)');
                }
            });
        });

        observer.observe(menuContainer, { childList: true, subtree: true });


        // ── 2. EVENT — Search input enhancement with .on() ────────────────────

        const $searchInput = $('#menu-search');
        if ($searchInput.length) {
            // 9. CONTENT — .after() to add a clear button
            $searchInput.after('<button id="jq-search-clear" class="jq-search-clear" style="display:none;" title="Clear search"><i class="fas fa-times"></i></button>');

            // 2. EVENT — .on('input') to show/hide clear button
            $searchInput.on('input', function () {
                const hasValue = $(this).val().length > 0;              // 7. ATTRIBUTE — .val()
                $('#jq-search-clear').toggle(hasValue);                  // 3. EFFECTS — .toggle()
            });

            // 2. EVENT — .on('click') to clear search
            $(document).on('click', '#jq-search-clear', function () {
                $searchInput.val('').trigger('input').focus();           // 7. ATTRIBUTE — .val() + trigger
                $(this).hide();                                          // 3. EFFECTS — .hide()
            });
        }


        // ── 2. EVENT — Filter pill click enhancement ──────────────────────────

        $(document).on('click', '.filter-pill', function () {
            const $this = $(this);
            const category = $this.data('category');                     // 7. ATTRIBUTE — .data()

            // 10. DOM TRAVERSAL — .siblings()
            $this.addClass('active').siblings('.filter-pill').removeClass('active');

            // 6. UTILITY — $.isNumeric() demo in console
            console.log('[jQuery $.isNumeric()] Is category numeric?', $.isNumeric(category));
        });
    }


    // ╔════════════════════════════════════════════════════════════════════════╗
    // ║  PAGE-SPECIFIC: CART PAGE                                           ║
    // ╚════════════════════════════════════════════════════════════════════════╝

    if ($('#cart-items-container').length) {
        initCartPageJQuery();
    }

    function initCartPageJQuery() {

        // ── 2. EVENT — Delegated remove with animation ────────────────────────

        // Enhance the remove button with a fade-out animation
        $(document).on('click', '.cart-remove-btn', function () {
            // 10. DOM TRAVERSAL — .closest() to find the cart item row
            const $row = $(this).closest('.cart-item');

            // 3. EFFECTS — .fadeOut() with completion callback
            // 5. CHAINING — chain slideUp after fadeOut
            $row.css('overflow', 'hidden')
                .animate({ opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0, marginBottom: 0 }, 400);
        });


        // ── 8. CSS — Dynamic total highlighting ───────────────────────────────

        // Observe total changes and pulse the total amount
        const $cartTotal = $('#cart-total');
        if ($cartTotal.length) {
            // Use MutationObserver to detect text changes
            const totalObserver = new MutationObserver(function () {
                // 5. CHAINING — addClass, delay, queue for pulse
                $cartTotal
                    .addClass('jq-total-pulse')
                    .delay(600)
                    .queue(function (next) {
                        $(this).removeClass('jq-total-pulse');
                        next();
                    });
            });

            totalObserver.observe($cartTotal[0], { childList: true, characterData: true, subtree: true });
        }


        // ── 9. CONTENT — .prepend() a coupon code section ─────────────────────

        const couponHTML = `
            <div class="jq-coupon-section" style="margin-bottom: 25px;">
                <h4 style="margin-bottom: 12px; font-size: 1rem;"><i class="fas fa-tag"></i> Have a Coupon?</h4>
                <div style="display: flex; gap: 10px;">
                    <input type="text" id="jq-coupon-input" class="form-input" placeholder="Enter coupon code" style="flex: 1; border-radius: 30px;">
                    <button id="jq-apply-coupon" class="btn" style="margin-top: 0; padding: 10px 20px; font-size: 0.85rem;">Apply</button>
                </div>
                <p id="jq-coupon-message" style="display:none; margin-top: 8px; font-size: 0.85rem;"></p>
            </div>`;

        // 9. CONTENT — .prepend() coupon section before order summary content
        $('.order-summary .card').prepend(couponHTML);

        // 2. EVENT — .on('click') for coupon application
        $('#jq-apply-coupon').on('click', function () {
            const $input = $('#jq-coupon-input');
            const $msg = $('#jq-coupon-message');
            const code = $.trim($input.val()).toUpperCase();            // 6. UTILITY — $.trim()

            if (code === 'COZY20') {
                $msg.html('<i class="fas fa-check-circle"></i> Coupon applied! 20% off.')
                    .css('color', '#4CAF50')
                    .hide().fadeIn(300);
                // 7. ATTRIBUTE — .prop()
                $input.prop('disabled', true);
                $(this).prop('disabled', true).text('Applied ✓');
            } else if (code === '') {
                $msg.html('<i class="fas fa-info-circle"></i> Please enter a coupon code.')
                    .css('color', '#ff9800')
                    .hide().fadeIn(300);
            } else {
                $msg.html('<i class="fas fa-times-circle"></i> Invalid coupon code.')
                    .css('color', '#dc3545')
                    .hide().fadeIn(300);
                // 5. CHAINING — shake effect
                $input.addClass('jq-shake').one('animationend', function () {
                    $(this).removeClass('jq-shake');
                });
            }
        });

        // Apply coupon on Enter key
        $('#jq-coupon-input').on('keypress', function (e) {
            if (e.which === 13) {
                e.preventDefault();
                $('#jq-apply-coupon').trigger('click');
            }
        });
    }


    // ╔════════════════════════════════════════════════════════════════════════╗
    // ║  PAGE-SPECIFIC: PAYMENT PAGE                                        ║
    // ╚════════════════════════════════════════════════════════════════════════╝

    if ($('#payment-form').length) {
        initPaymentPageJQuery();
    }

    function initPaymentPageJQuery() {

        // ── 7. ATTRIBUTE — .attr() Tooltip system ─────────────────────────────

        const tooltipMap = {
            'pay-name': 'Enter your full name as it appears on your ID',
            'pay-email': 'We\'ll send the order confirmation here',
            'pay-phone': 'For delivery updates (optional)',
            'pay-address': 'Complete address with landmark for smooth delivery',
            'pay-card': 'Your UPI ID or card number',
            'pay-expiry': 'Card expiration date in MM/YY format',
            'pay-cvv': '3-digit security code on the back of your card'
        };

        // 6. UTILITY — $.each() over the tooltip map
        $.each(tooltipMap, function (fieldId, tooltipText) {
            const $field = $('#' + fieldId);
            if ($field.length) {
                // 7. ATTRIBUTE — .attr() to add title tooltip
                $field.attr('title', tooltipText);

                // 9. CONTENT — .after() to add a tooltip icon
                const $group = $field.closest('.form-group');          // 10. DOM TRAVERSAL — .closest()
                const $label = $group.find('.form-label');             // 10. DOM TRAVERSAL — .find()

                if ($label.length && !$label.find('.jq-tooltip-icon').length) {
                    // 9. CONTENT — .append() tooltip icon to label
                    $label.append(`<i class="fas fa-info-circle jq-tooltip-icon" data-tooltip="${tooltipText}"></i>`);
                }
            }
        });

        // 2. EVENT — .hover() on tooltip icons
        $(document).on('mouseenter', '.jq-tooltip-icon', function (e) {
            const text = $(this).data('tooltip');                      // 7. ATTRIBUTE — .data()
            const $tip = $('<div class="jq-tooltip-popup">' + text + '</div>');

            $('body').append($tip);                                    // 9. CONTENT — .append()

            // 8. CSS — .css() for positioning
            $tip.css({
                top: e.pageY - $tip.outerHeight() - 10,
                left: e.pageX - ($tip.outerWidth() / 2)
            }).fadeIn(200);                                             // 3. EFFECTS — .fadeIn()

        }).on('mouseleave', '.jq-tooltip-icon', function () {
            // 9. CONTENT — .remove() tooltip from DOM
            $('.jq-tooltip-popup').remove();
        });


        // ── 8. CSS — .animate() form field focus effect ───────────────────────

        $('#payment-form .form-input')
            .on('focus', function () {
                // 10. DOM TRAVERSAL — .parent() to style container
                $(this).parent().find('.form-label').animate(
                    { fontSize: '0.8rem' }, 200                       // 8. CSS — .animate()
                );
            })
            .on('blur', function () {
                if (!$(this).val()) {                                  // 7. ATTRIBUTE — .val()
                    $(this).parent().find('.form-label').animate(
                        { fontSize: '' }, 200
                    );
                }
            });


        // ── 2. EVENT — Payment method toggle with .slideToggle() ──────────────

        $('input[name="payment"]').on('change', function () {
            const isCard = $(this).val() === 'card';                   // 7. ATTRIBUTE — .val()

            // 10. DOM TRAVERSAL — .next() sibling element
            const $expiryRow = $('#pay-expiry').closest('.form-group').parent();

            if (isCard) {
                $expiryRow.slideDown(300);                              // 3. EFFECTS — .slideDown()
            } else {
                $expiryRow.slideUp(300);                                // 3. EFFECTS — .slideUp()
            }
        });


        // ── 9. CONTENT — .before() to add a security notice ──────────────────

        const securityNotice = `
            <div class="jq-security-notice">
                <i class="fas fa-lock"></i>
                <span>Your payment information is secure and encrypted</span>
            </div>`;

        // 9. CONTENT — .before() the submit button area
        $('#payment-form button[type="submit"]').parent().before(securityNotice);


        // ── 7. ATTRIBUTE — .removeAttr() on form submission ──────────────────

        // Add character counter for address field
        const $addressField = $('#pay-address');
        if ($addressField.length) {
            // 9. CONTENT — .after() character counter
            $addressField.after('<span class="jq-char-counter">0 / 200 characters</span>');

            // 2. EVENT — .on('input') for live character count
            $addressField.on('input', function () {
                const len = $(this).val().length;                       // 7. ATTRIBUTE — .val()
                const $counter = $(this).next('.jq-char-counter');      // 10. DOM TRAVERSAL — .next()
                $counter.text(len + ' / 200 characters');

                // 8. CSS — .css() for color change
                if (len > 180) {
                    $counter.css('color', '#dc3545');
                } else if (len > 100) {
                    $counter.css('color', '#ff9800');
                } else {
                    $counter.css('color', '#999');
                }

                // 7. ATTRIBUTE — set maxlength dynamically
                $(this).attr('maxlength', 200);                         // 7. ATTRIBUTE — .attr()
            });
        }
    }


    // ╔════════════════════════════════════════════════════════════════════════╗
    // ║  GLOBAL — Keyboard Shortcuts (Events)                               ║
    // ╚════════════════════════════════════════════════════════════════════════╝

    // 2. EVENT — .on('keydown') for keyboard shortcuts
    $(document).on('keydown', function (e) {
        // Ctrl+Shift+T → Toggle promo banner
        if (e.ctrlKey && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            $('#jq-promo-banner').slideToggle(400);                     // 3. EFFECTS — .slideToggle()
        }
    });


    // ╔════════════════════════════════════════════════════════════════════════╗
    // ║  GLOBAL — Typed Text Effect using jQuery                            ║
    // ╚════════════════════════════════════════════════════════════════════════╝

    // 9. CONTENT — .text() to manipulate footer tagline
    const $footerTagline = $('.footer-content div:first-child p');
    if ($footerTagline.length) {
        const originalText = $footerTagline.text();                    // 9. CONTENT — .text() getter
        const emojis = ['☕', '🍵', '🫖', '🧁'];

        // 6. UTILITY — $.each() for emoji rotation
        let emojiIndex = 0;
        setInterval(function () {
            const emoji = emojis[emojiIndex % emojis.length];
            // 9. CONTENT — .html() setter with formatted content
            $footerTagline.html(emoji + ' ' + originalText + ' ' + emoji);
            emojiIndex++;
        }, 3000);
    }


    // ── Console Summary ───────────────────────────────────────────────────────
    console.log('%c☕ Cozy Cafe — jQuery Features Loaded', 'color: #D7A86E; font-size: 14px; font-weight: bold;');
    console.log('%cjQuery v' + $.fn.jquery + ' active with 10 feature categories', 'color: #6D4C41;');

});

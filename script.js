document.addEventListener('DOMContentLoaded', () => {
    
    // Luxury Page Entrance
    const container = document.querySelector('.container');
    setTimeout(() => {
        if(container) container.classList.add('loaded');
    }, 100);
    /* ==============================
       0. CUSTOM CURSOR LOGIC
       ============================== */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline follows with a slight lag via animation/transition in CSS
        // but we update its position here
        cursorOutline.style.left = `${posX}px`;
        cursorOutline.style.top = `${posY}px`;
    });

    // Cursor scaling on interactive elements
    const interactables = document.querySelectorAll('a, button, .service-card, .ba-handle');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.width = '70px';
            cursorOutline.style.height = '70px';
            cursorOutline.style.backgroundColor = 'rgba(245, 151, 40, 0.1)';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.width = '40px';
            cursorOutline.style.height = '40px';
            cursorOutline.style.backgroundColor = 'transparent';
        });
    });

    /* ==============================
       0.1 DYNAMIC GLOW (GLASSMORPHISM 2.0)
       ============================== */
    const glowCards = document.querySelectorAll('.service-card, .team-card');
    glowCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });


    /* ==============================
       1. SCROLL REVEAL ANIMATIONS
       ============================== */
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active'); 
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    revealElements.forEach(el => observer.observe(el));

    /* ==============================
       2. STICKY NAVBAR EFFECT
       ============================== */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* ==============================
       3. PARALLAX PRO TEXT "BARBER"
       ============================== */
    const bgText = document.querySelector('.bg-text');
    window.addEventListener('scroll', () => {
        if (bgText) {
            const scrollPos = window.scrollY;
            bgText.style.transform = `translate(-50%, calc(-50% + ${scrollPos * 0.4}px))`;
        }
    });

    /* ==============================
       4. MOBILNÍ MENU
       ============================== */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMobileMenuBtn = document.getElementById('close-mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    const openMenu = () => {
        mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMenu);
    if (closeMobileMenuBtn) closeMobileMenuBtn.addEventListener('click', closeMenu);
    mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

    /* ==============================
       5. REZERVAČNÍ MODAL OKNO A FORMULÁŘ
       ============================== */
    const modalOverlay = document.getElementById('booking-modal');
    const openBookingBtns = document.querySelectorAll('.open-booking');
    const bookingForm = document.getElementById('booking-form');
    const bookingContent = document.getElementById('booking-content');
    const bookingSuccess = document.getElementById('booking-success');
    const closeSuccessBtn = document.getElementById('close-success-btn');

    const toggleModal = (e) => {
        if(e) e.preventDefault();
        
        // Reset states if opening newly
        if(!modalOverlay.classList.contains('active')) {
            bookingContent.style.display = 'block';
            bookingSuccess.style.display = 'none';
            if(bookingForm) bookingForm.reset();
            
            // Pokud tlačítko obsahuje specifikovaného barbera, rovnou ho vybereme
            if (e && e.currentTarget && e.currentTarget.hasAttribute('data-barber')) {
                const barberId = e.currentTarget.getAttribute('data-barber');
                const barberSelect = document.getElementById('booking-barber');
                if (barberSelect) barberSelect.value = barberId;
            }
        }

        modalOverlay.classList.toggle('active');
        if(modalOverlay.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
            if(mobileMenuOverlay.classList.contains('active')) closeMenu();
        } else {
            document.body.style.overflow = '';
        }
    };

    openBookingBtns.forEach(btn => btn.addEventListener('click', toggleModal));
    document.getElementById('close-modal').addEventListener('click', toggleModal);
    closeSuccessBtn.addEventListener('click', toggleModal);
    
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) toggleModal();
    });

    /* ==============================
       CENTRALIZOVANÁ DATA WEBU (SSOT)
       ============================== */
    const JESLE_DATA = {
        hours: {
            weekday: { start: 9, end: 19, label: '9:00 - 19:00' },
            saturday: { start: 9, end: 14, label: '9:00 - 14:00' },
            sunday: { label: 'Zavřeno' }
        },
        services: [
            { id: '1', name: 'Klasický Střih', price: 590, duration: 60, desc: 'Konzultace, mytí, střih, styling' },
            { id: '2', name: 'Úprava Vousů', price: 390, duration: 60, desc: 'Tvarování, napaření, břitva, olej' },
            { id: '3', name: 'VIP Kombo', price: 890, duration: 90, desc: 'Střih + vousy + kompletní relax' }
        ],
        location: {
            address: 'Opletalova 33, Praha 1',
            parking: 'Modré zóny v okolí, nebo garáže u Hlavního nádraží (5 min pěšky).'
        },
        bookingInterval: 30 // minut
    };

    // Helper: Výpočet dostupných slotů pro daný den a délku služby
    const getAvailableSlots = (dateStr, duration) => {
        const slots = [];
        const dateObj = new Date(dateStr);
        const dayOfWeek = dateObj.getDay();
        
        let config = JESLE_DATA.hours.weekday;
        if(dayOfWeek === 6) config = JESLE_DATA.hours.saturday;
        if(dayOfWeek === 0) return []; // Neděle zavřeno

        const now = new Date();
        const isToday = dateStr === now.toISOString().split('T')[0];

        let currentTime = new Date(dateStr);
        currentTime.setHours(config.start, 0, 0, 0);

        const endTime = new Date(dateStr);
        endTime.setHours(config.end, 0, 0, 0);

        while(currentTime.getTime() + (duration * 60000) <= endTime.getTime()) {
            if(!isToday || currentTime > now) {
                const hours = currentTime.getHours();
                const mins = currentTime.getMinutes();
                slots.push({
                    time: `${hours}:${mins === 0 ? '00' : mins}`,
                    iso: currentTime.toISOString()
                });
            }
            currentTime.setMinutes(currentTime.getMinutes() + JESLE_DATA.bookingInterval);
        }
        return slots;
    };

    // Simulace záchytu odeslání a zobrazení Success animace
    if(bookingForm) {
        
        /* --- Nová logika výběru termínu --- */

        const serviceSelect = document.getElementById('booking-service');
        const datePickerList = document.getElementById('date-picker-list');
        const timeGrid = document.getElementById('time-slots-grid');
        const finalTimeInput = document.getElementById('final-appointment-time');
        const submitBtn = document.getElementById('submit-booking');

        let selectedDate = null;
        let selectedDuration = 0;

        const initBookingSystem = () => {
            // Generování 14 dní dopředu
            datePickerList.innerHTML = '';
            const today = new Date();
            let count = 0;
            let i = 0;

            while(count < 14) {
                const date = new Date();
                date.setDate(today.getDate() + i);
                
                if(date.getDay() !== 0) { // Přeskočit neděli
                    const card = document.createElement('div');
                    card.className = 'date-card';
                    card.dataset.date = date.toISOString().split('T')[0];
                    
                    const dayName = date.toLocaleDateString('cs-CZ', { weekday: 'short' });
                    const dayNum = date.getDate();
                    
                    card.innerHTML = `
                        <span class="day-name">${dayName}</span>
                        <span class="day-num">${dayNum}</span>
                    `;
                    
                    card.onclick = () => {
                        document.querySelectorAll('.date-card').forEach(c => c.classList.remove('active'));
                        card.classList.add('active');
                        selectedDate = card.dataset.date;
                        renderSlots();
                    };
                    
                    datePickerList.appendChild(card);
                    count++;
                }
                i++;
            }
        };

        const renderSlots = () => {
            if(!selectedDate || !selectedDuration) return;
            
            // Při změně dne nebo služby ihned uzamknout tlačítko a vymazat vybraný čas
            finalTimeInput.value = '';
            submitBtn.disabled = true;
            
            timeGrid.innerHTML = '';
            const slots = getAvailableSlots(selectedDate, selectedDuration);

            slots.forEach(slotData => {
                const slot = document.createElement('div');
                slot.className = 'time-slot';
                slot.textContent = slotData.time;
                slot.dataset.fullTime = slotData.iso;
                
                slot.onclick = () => {
                    document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('active'));
                    slot.classList.add('active');
                    finalTimeInput.value = slot.dataset.fullTime;
                    submitBtn.disabled = false;
                };
                
                timeGrid.appendChild(slot);
            });

            if(slots.length === 0) {
                timeGrid.innerHTML = '<p class="empty-state">Pro tento den už nejsou volné časy.</p>';
            }
        };

        serviceSelect.onchange = (e) => {
            const option = e.target.options[e.target.selectedIndex];
            selectedDuration = parseInt(option.dataset.duration);
            renderSlots();
        };

        initBookingSystem();

        /* --- Odeslání formuláře --- */
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Plynulý přechod (fade out form, pak přesměrování)
            bookingContent.style.opacity = '0';
            bookingContent.style.transform = 'translateY(-10px)';
            bookingContent.style.transition = '0.4s ease';
            document.body.style.cursor = 'wait'; // Ukáže načítání
            
            setTimeout(() => {
                window.location.href = 'thank-you.html';
            }, 400);
        });
    }

    /* ==============================
       6. PŘED / PO (BEFORE/AFTER) SLIDER
       ============================== */
    const baContainer = document.getElementById('ba-slider');
    const baResize = document.getElementById('ba-resize');
    const baHandle = document.getElementById('ba-handle');

    if(baContainer && baResize && baHandle) {
        let isSliding = false;

        const slideMove = (xPos) => {
            const minLoc = 0;
            const maxLoc = baContainer.offsetWidth;
            if(xPos < minLoc) xPos = minLoc;
            if(xPos > maxLoc) xPos = maxLoc;
            
            const percent = (xPos / maxLoc) * 100;
            baResize.style.width = percent + '%';
            baHandle.style.left = percent + '%';
        };

        const onMouseMove = (e) => {
            if(!isSliding) return;
            const rect = baContainer.getBoundingClientRect();
            slideMove(e.clientX - rect.left);
        };

        const onTouchMove = (e) => {
            if(!isSliding) return;
            const rect = baContainer.getBoundingClientRect();
            slideMove(e.touches[0].clientX - rect.left);
        };

        // Desktop
        baContainer.addEventListener('mousedown', (e) => {
            isSliding = true;
            const rect = baContainer.getBoundingClientRect();
            slideMove(e.clientX - rect.left);
        });
        window.addEventListener('mouseup', () => isSliding = false);
        window.addEventListener('mousemove', onMouseMove);

        // Mobile
        baContainer.addEventListener('touchstart', (e) => {
            isSliding = true;
            const rect = baContainer.getBoundingClientRect();
            slideMove(e.touches[0].clientX - rect.left);
        });
        window.addEventListener('touchend', () => isSliding = false);
        window.addEventListener('touchmove', onTouchMove);
    }

    /* ==============================
       7. SMOOTH SCROLLING 
       ============================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if(targetId && targetId !== '#') {
                const targetEl = document.querySelector(targetId);
                if(targetEl) {
                    e.preventDefault();
                    const headerOffset = 80;
                    const elementPosition = targetEl.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            }
        });
    });
    /* ==============================
       8. AKTIVNÍ CHATBOT (MAX) LOGIKA - INTELIGENCE 2.0
       ============================== */
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const chatReplies = document.querySelectorAll('.quick-btn');
    const chatBadge = document.getElementById('chat-badge');

    let botInitialized = false;

    // --- POMOCNÉ FUNKCE PRO POMYSLNOU AI ---
    
    // Extrakce entit (datum a čas) z textu
    const extractEntities = (text) => {
        let entities = { day: null, time: null };
        const lower = text.toLowerCase();

        // Jednoduchá detekce dne
        if (lower.includes('dnes')) entities.day = 'dnes';
        else if (lower.includes('zítra') || lower.includes('zitra')) entities.day = 'zítra';
        else if (lower.includes('pondělí') || lower.includes('pondeli')) entities.day = 'v pondělí';
        else if (lower.includes('úterý') || lower.includes('utery')) entities.day = 'v úterý';
        else if (lower.includes('středa') || lower.includes('streda')) entities.day = 've středu';
        else if (lower.includes('čtvrtek') || lower.includes('ctvrtek')) entities.day = 've čtvrtek';
        else if (lower.includes('pátek') || lower.includes('patek')) entities.day = 'v pátek';
        else if (lower.includes('sobota') || lower.includes('sobotu')) entities.day = 'v sobotu';

        // Detekce času (formáty 19:00, 19.00, v 7, v sedm...)
        const timeRegex = /(\d{1,2}[:.]\d{2})|(?:v\s?)(\d{1,2})(?:\s?večer|odpoledne|ráno)?/i;
        const timeMatch = lower.match(timeRegex);
        
        if (timeMatch) {
            if (timeMatch[1]) entities.time = timeMatch[1];
            else if (timeMatch[2]) {
                let hour = parseInt(timeMatch[2]);
                if (lower.includes('večer') && hour < 12) hour += 12;
                entities.time = `${hour}:00`;
            }
        }

        return entities;
    };

    // Hlavní "převodník" úmyslu a odpovědi
    const getMaxResponse = (input) => {
        const text = input.toLowerCase();
        const entities = extractEntities(text);
        
        // Pomocné pro hledání v datech
        const findService = (query) => JESLE_DATA.services.find(s => query.includes(s.name.toLowerCase()));

        // Sady klíčových slov
        const resKWs = ['rezerva', 'objedn', 'střih', 'strih', 'termín', 'termin', 'volno', 'místo', 'misto', 'čas', 'cas', 'kdy'];
        const priceKWs = ['cena', 'ceník', 'ceny', 'stojí', 'stoji', 'peněz', 'kolik', 'umíte', 'umite', 'služb', 'sluzb', 'nabíz', 'nabiz'];
        const locoKWs = ['adresa', 'kde', 'najdu', 'lokalita', 'ulice', 'parkov', 'mapa'];

        // Kontrola úmyslů
        const isReservation = resKWs.some(kw => text.includes(kw));
        const isPrice = priceKWs.some(kw => text.includes(kw));
        const isLoco = locoKWs.some(kw => text.includes(kw));

        // 1. REZERVACE A VOLNÉ TERMÍNY
        if (isReservation) {
            let targetDayStr = entities.day || 'dnes';
            let dateToSearch = new Date();
            
            // Mapování textu na reálný datum
            if (targetDayStr.includes('zítra')) dateToSearch.setDate(dateToSearch.getDate() + 1);
            else if (targetDayStr.includes('pondělí')) dateToSearch.setDate(dateToSearch.getDate() + (1 + 7 - dateToSearch.getDay()) % 7);
            else if (targetDayStr.includes('úterý')) dateToSearch.setDate(dateToSearch.getDate() + (2 + 7 - dateToSearch.getDay()) % 7);
            else if (targetDayStr.includes('středa')) dateToSearch.setDate(dateToSearch.getDate() + (3 + 7 - dateToSearch.getDay()) % 7);
            else if (targetDayStr.includes('čtvrtek')) dateToSearch.setDate(dateToSearch.getDate() + (4 + 7 - dateToSearch.getDay()) % 7);
            else if (targetDayStr.includes('pátek')) dateToSearch.setDate(dateToSearch.getDate() + (5 + 7 - dateToSearch.getDay()) % 7);
            else if (targetDayStr.includes('sobota')) dateToSearch.setDate(dateToSearch.getDate() + (6 + 7 - dateToSearch.getDay()) % 7);

            const dateKey = dateToSearch.toISOString().split('T')[0];
            const slots = getAvailableSlots(dateKey, 60); // Defaultní 60min střih pro kontrolu

            if (slots.length > 0) {
                const dayLabel = targetDayStr === 'dnes' ? 'dneska' : (targetDayStr === 'zítra' ? 'zítra' : targetDayStr);
                const firstSlots = slots.slice(0, 3).map(s => s.time).join(', ');
                
                return `Jasná věc! ✂️ Na **${dayLabel}** tam vidím volno třeba v **${firstSlots}**. <br><br> Chceš to rovnou zarezervovat? <br><button class="btn-primary mt-2 open-booking">Jasně, jdu do toho!</button>`;
            } else {
                return `Hele, na ${targetDayStr} už tam bohužel nic volnýho nevidím. 😔 Zkus mrknout na jinej den, nebo si napiš o termín později!`;
            }
        }

        // 2. CENY A SLUŽBY
        if (isPrice) {
            const service = findService(text);
            if (service) {
                return `Jasně, **${service.name}** u nás vyjde na **${service.price} Kč** a trvá cca **${service.duration} minut**. <br><br> Je to absolutní relax, věř mi! 😉`;
            }
            return `Tady máš náš přehled služeb, brácho: <br><br> ✂️ **Klasický Střih** - Od 590 Kč <br> 🪒 **Úprava Vousů** - Od 390 Kč <br> 🔥 **Kombo (Vlasy + Vousy)** - Od 890 Kč <br><br> Co si z toho pro tebe vybereme?`;
        }

        // 3. LOKALITA A PARKOVÁNÍ
        if (isLoco) {
            return `Najdeš nás na adrese **${JESLE_DATA.location.address}**. 📍 <br><br> Co se týče parkování, ${JESLE_DATA.location.parking}`;
        }

        // 4. DEFAULT POZDRAV / NEVÍM
        if (text.includes('ahoj') || text.includes('čau') || text.includes('zdar')) {
            return "Čau! Jsem Max a postarám se o tebe. 👊 Chceš se objednat, nebo tě zajímá, co všechno umíme?";
        }

        return "Hele, teď ti úplně nerozumím, radši se držím hřebenu a nůžek. ✂️ Ale klidně se zeptej na naše služby, ceny nebo rezervace!";
    };


    // --- ZÁKLADNÍ FUNKCE CHATU ---

    const toggleChat = () => {
        if (!chatWindow) return;
        chatWindow.classList.toggle('active');
        if (chatWindow.classList.contains('active')) {
            if (chatBadge) chatBadge.style.display = 'none';
            if (chatToggle) {
                chatToggle.style.opacity = '0';
                chatToggle.style.pointerEvents = 'none';
            }
            if (!botInitialized) {
                setTimeout(() => initializeBot(), 500);
            }
        } else {
            if (chatToggle) {
                chatToggle.style.opacity = '1';
                chatToggle.style.pointerEvents = 'auto';
            }
        }
    };

    if (chatToggle) chatToggle.addEventListener('click', toggleChat);
    if (chatClose) chatClose.addEventListener('click', toggleChat);

    const addMessage = (text, sender) => {
        if (!chatMessages) return;
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('chat-message', sender === 'bot' ? 'msg-bot' : 'msg-user');
        
        if (sender === 'user') {
            // Ochrana proti XSS - uživatelský vstup vložen bezpečně přes textContent
            msgDiv.textContent = text;
        } else {
            // Bot používá bezpečné předdefinované řetězce, proto můžeme nechat innerHTML (pro značky <strong>)
            msgDiv.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        }
        
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const showTyping = () => {
        if (!chatMessages) return;
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('typing-indicator');
        typingDiv.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
        typingDiv.id = 'typing-indicator';
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return typingDiv;
    };

    const botReply = (text) => {
        const typing = showTyping();
        if (!typing) return;
        setTimeout(() => {
            typing.remove();
            addMessage(text, 'bot');
        }, 1500);
    };

    const initializeBot = () => {
        botInitialized = true;
        botReply("Čau! Jsem Max, tvoje virtuální spojka s Jesle Barber Shopem. Potřebuješ se objednat nebo tě zajímá, co všechno umíme?");
    };

    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const msg = chatInput.value.trim();
            if (msg) {
                addMessage(msg, 'user');
                chatInput.value = '';
                setTimeout(() => {
                    botReply(getMaxResponse(msg));
                }, 500);
            }
        });
    }

    chatReplies.forEach(btn => {
        btn.addEventListener('click', () => {
            const msg = btn.getAttribute('data-msg');
            addMessage(msg, 'user');
            setTimeout(() => {
                botReply(getMaxResponse(msg));
            }, 500);
        });
    });

    // Delegace pro dynamická tlačítka v chatu (např. Maxovo "Jasně, jdu do toho!")
    if (chatMessages) {
        chatMessages.addEventListener('click', (e) => {
            if (e.target.classList.contains('open-booking')) {
                toggleModal();
            }
        });
    }

    // Otevření Maxe po 15s při každé nové návštěvě v rámci jednoho sezení (sessionStorage)
    if (!sessionStorage.getItem('maxSessionOpened')) {
        setTimeout(() => {
            if (chatWindow && !chatWindow.classList.contains('active')) {
                toggleChat(); 
            }
            sessionStorage.setItem('maxSessionOpened', 'true');
        }, 15000); // 15 sekund
    } else {
        // Pro pohyb po stránce (když už je sessions otevřená)
        setTimeout(() => {
            if (!botInitialized && chatBadge) {
                chatBadge.style.display = 'flex';
            }
        }, 8000);
    }

});



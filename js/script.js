/**
 * TAKASAGOing! FESTA - 第58回ブロック大会高砂大会
 * JavaScript ファイル（修正版）
 */

// ===============================
// 1. テキストアニメーションシステム
// ===============================

// アニメーション設定
const textAnimationConfig = {
    // レスポンシブ対応
    isDesktop: window.innerWidth >= 1024,
    isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
    isMobile: window.innerWidth < 768,
    
    // アニメーション有効/無効
    isEnabled: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    
    // 修正されたタイミング設定
    timing: {
        logo: 500,          // 0.5秒: ロゴ登場
        contentGroup: 1000, // 1.0秒: サブタイトル + イベント情報 同時
        countdown: 2000,    // 2.0秒: カウントダウン
        confetti: 575      // 2.5秒: 紙吹雪（トップ位置のみ）
    }
};

// 動的CSSアニメーション追加
function injectAnimationCSS() {
    const style = document.createElement('style');
    style.textContent = `
        /* テキストアニメーション用CSS */
        .text-animation-ready .main-logo,
        .text-animation-ready .content-group,
        .text-animation-ready .countdown {
            opacity: 0;
            transform: translateY(50px);
        }

        /* コンテンツグループ（サブタイトル + イベント情報）のスタイル */
        .content-group {
            /* サブタイトルとイベント情報をグループ化 */
        }

        /* ロゴアニメーション（浮遊削除版） */
        .logo-bounce-in {
            animation: logoBounceIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        @keyframes logoBounceIn {
            0% {
                opacity: 0;
                transform: translateY(100px) scale(0.3) rotate(-5deg);
            }
            50% {
                opacity: 1;
                transform: translateY(-20px) scale(1.1) rotate(2deg);
            }
            75% {
                transform: translateY(10px) scale(0.95) rotate(-1deg);
            }
            100% {
                opacity: 1;
                transform: translateY(0) scale(1) rotate(0deg);
            }
        }

        /* コンテンツグループアニメーション（統合版） */
        .content-group-fade-swing {
            animation: contentGroupFadeSwing 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes contentGroupFadeSwing {
            0% {
                opacity: 0;
                transform: translateY(-30px) rotate(-1deg) scale(0.95);
            }
            60% {
                opacity: 1;
                transform: translateY(5px) rotate(0.5deg) scale(1.02);
            }
            100% {
                opacity: 1;
                transform: translateY(0) rotate(0deg) scale(1);
            }
        }

        /* カウントダウンアニメーション */
        .countdown-rotate-in {
            animation: countdownRotateIn 1s ease-out forwards;
        }

        @keyframes countdownRotateIn {
            0% {
                opacity: 0;
                transform: rotateY(-90deg) scale(0.5);
            }
            50% {
                opacity: 1;
                transform: rotateY(10deg) scale(1.1);
            }
            100% {
                opacity: 1;
                transform: rotateY(0deg) scale(1);
            }
        }

        .countdown-item-delay-1 { animation-delay: 0.1s; }
        .countdown-item-delay-2 { animation-delay: 0.2s; }
        .countdown-item-delay-3 { animation-delay: 0.3s; }
        .countdown-item-delay-4 { animation-delay: 0.4s; }

        /* 太鼓エフェクト */
        .taiko-effect {
            position: fixed;
            top: 50%;
            left: 50%;
            width: 100px;
            height: 100px;
            background: radial-gradient(circle, rgba(248, 181, 0, 0.8) 0%, rgba(232, 58, 92, 0.4) 50%, transparent 100%);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            pointer-events: none;
            z-index: 10;
            animation: taikoRipple 0.6s ease-out;
        }

        @keyframes taikoRipple {
            0% {
                transform: translate(-50%, -50%) scale(0);
                opacity: 1;
            }
            100% {
                transform: translate(-50%, -50%) scale(8);
                opacity: 0;
            }
        }

        /* レスポンシブ調整 */
        @media (max-width: 768px) {
            @keyframes logoBounceIn {
                0% {
                    opacity: 0;
                    transform: translateY(50px) scale(0.5);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
        }

        /* アクセシビリティ対応 */
        @media (prefers-reduced-motion: reduce) {
            .main-logo,
            .content-group,
            .countdown {
                animation: none !important;
                opacity: 1 !important;
                transform: none !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// 太鼓エフェクト生成
function createTaikoEffect() {
    if (!textAnimationConfig.isEnabled || textAnimationConfig.isMobile) return;
    
    const effect = document.createElement('div');
    effect.className = 'taiko-effect';
    document.body.appendChild(effect);
    
    setTimeout(() => {
        effect.remove();
    }, 600);
}

// メインテキストアニメーション制御
function initTextAnimations() {
    // アニメーション無効の場合は早期リターン
    if (!textAnimationConfig.isEnabled) {
        console.log('🔇 テキストアニメーション: 無効（アクセシビリティ設定）');
        return;
    }

    console.log('🎭 テキストアニメーション開始');
    
    // 要素取得
    const mainVisual = document.querySelector('.main-visual');
    const logo = document.querySelector('.main-logo');
    const subtitle = document.querySelector('.main-subtitle');
    const eventInfo = document.querySelector('.event-info');
    const countdown = document.querySelector('.countdown');
    const countdownItems = document.querySelectorAll('.countdown-item');

    if (!mainVisual || !logo || !subtitle || !eventInfo || !countdown) {
        console.warn('⚠️ 必要なテキスト要素が見つかりません');
        return;
    }

    // コンテンツグループ作成（サブタイトル + イベント情報）
    const contentGroup = document.createElement('div');
    contentGroup.className = 'content-group';
    
    // サブタイトルとイベント情報をグループに移動
    subtitle.parentNode.insertBefore(contentGroup, subtitle);
    contentGroup.appendChild(subtitle);
    contentGroup.appendChild(eventInfo);

    // 初期状態設定
    mainVisual.classList.add('text-animation-ready');

    // アニメーション実行
    setTimeout(() => {
        // 1. 太鼓エフェクト + ロゴ登場
        createTaikoEffect();
        logo.classList.add('logo-bounce-in');
        console.log('🥁 太鼓エフェクト + ロゴ登場');
    }, textAnimationConfig.timing.logo);

    setTimeout(() => {
        // 2. コンテンツグループ登場（サブタイトル + イベント情報 同時）
        contentGroup.classList.add('content-group-fade-swing');
        console.log('📝 サブタイトル + イベント情報 同時登場');
    }, textAnimationConfig.timing.contentGroup);

    setTimeout(() => {
        // 3. カウントダウン登場
        countdown.classList.add('countdown-rotate-in');
        
        // 各カウントダウンアイテムに遅延を追加
        countdownItems.forEach((item, index) => {
            item.classList.add(`countdown-item-delay-${index + 1}`);
        });
        
        console.log('⏰ カウントダウン登場');
        
        // 4. アニメーション完了後にクリーンアップ
        setTimeout(() => {
            mainVisual.classList.remove('text-animation-ready');
            console.log('✨ テキストアニメーション完了');
        }, 1000);
        
    }, textAnimationConfig.timing.countdown);
}

// 画面リサイズ時の設定更新
function updateTextAnimationConfig() {
    textAnimationConfig.isDesktop = window.innerWidth >= 1024;
    textAnimationConfig.isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    textAnimationConfig.isMobile = window.innerWidth < 768;
}

// ===============================
// 2. 紙吹雪システム（修正版）
// ===============================

// 紙吹雪の設定（数量増加版）
const confettiConfig = {
    colors: ['#e83a5c', '#33a3dc', '#f8b500', '#e95464', '#aacf53', '#f08300', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24'],
    shapes: ['round', 'square', 'oval'],
    burstCount: window.innerWidth < 576 ? 40 : window.innerWidth < 768 ? 60 : 80,
    // 継続紙吹雪数量を増加
    continuousCount: window.innerWidth < 576 ? 25 : window.innerWidth < 768 ? 35 : 45
};

// 初期爆発アニメーション
function createBurstConfetti() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    for (let i = 0; i < confettiConfig.burstCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = `confetti burst ${confettiConfig.shapes[Math.floor(Math.random() * 3)]}`;
        
        // ランダムな色
        const color = confettiConfig.colors[Math.floor(Math.random() * confettiConfig.colors.length)];
        confetti.style.backgroundColor = color;
        
        // 中央からの放射状の方向を計算
        const angle = (Math.PI * 2 * i) / confettiConfig.burstCount + Math.random() * 0.5;
        const velocity = 100 + Math.random() * 150; // 初速度のランダム化
        const dx = Math.cos(angle) * velocity;
        const dy = Math.sin(angle) * velocity;
        
        // CSS変数として方向を設定
        confetti.style.setProperty('--dx', `${dx}px`);
        confetti.style.setProperty('--dy', `${dy}px`);
        
        // 初期位置を画面中央に設定
        confetti.style.left = `${centerX}px`;
        confetti.style.top = `${centerY}px`;
        
        // ランダムなサイズ
        const size = 8 + Math.random() * 12;
        confetti.style.width = `${size}px`;
        confetti.style.height = confetti.className.includes('oval') ? `${size * 1.5}px` : `${size}px`;
        
        document.body.appendChild(confetti);
        
        // 4秒後に要素を削除
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.remove();
            }
        }, 4000);
    }
}

// 継続的な落下アニメーション
function createFallingConfetti() {
    // 既存の落下紙吹雪の数をチェック
    const existingFalling = document.querySelectorAll('.confetti.falling');
    
    // 最大数に達していない場合のみ新しく作成
    if (existingFalling.length < confettiConfig.continuousCount) {
        const confetti = document.createElement('div');
        confetti.className = `confetti falling ${confettiConfig.shapes[Math.floor(Math.random() * 3)]}`;
        
        // ランダムな色
        const color = confettiConfig.colors[Math.floor(Math.random() * confettiConfig.colors.length)];
        confetti.style.backgroundColor = color;
        
        // ランダムな開始位置（画面上部）
        const startX = Math.random() * window.innerWidth;
        confetti.style.left = `${startX}px`;
        confetti.style.top = '-20px';
        
        // ひらひらとした横の動き
        const swing = (Math.random() - 0.5) * 100;
        confetti.style.setProperty('--swing', `${swing}px`);
        
        // ランダムなサイズ
        const size = 8 + Math.random() * 8;
        confetti.style.width = `${size}px`;
        confetti.style.height = confetti.className.includes('oval') ? `${size * 1.5}px` : `${size}px`;
        
        // ランダムなアニメーション遅延
        confetti.style.animationDelay = `${Math.random() * 2}s`;
        
        document.body.appendChild(confetti);
        
        // 8秒後に要素を削除（アニメーション完了後）
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.remove();
            }
        }, 8000);
    }
}

// 継続的な落下紙吹雪の管理
function manageContinuousConfetti() {
    createFallingConfetti();
    
    // 次の紙吹雪生成までの間隔（ランダム）
    const nextInterval = 300 + Math.random() * 1000; // 間隔を短縮して密度アップ
    setTimeout(manageContinuousConfetti, nextInterval);
}

// 紙吹雪システムの初期化（修正版）
function initConfettiSystem() {
    // トップ位置でのみ爆発アニメーション実行
    if (window.scrollY === 0) {
        setTimeout(() => {
            console.log('🎉 初期爆発アニメーション開始（トップ位置）');
            createBurstConfetti();
            
            // 5秒後に継続的な落下アニメーションを開始
            setTimeout(() => {
                console.log('✨ 継続落下アニメーション開始（増量版）');
                manageContinuousConfetti();
            }, 5000);
        }, textAnimationConfig.timing.confetti);
    } else {
        // トップ位置以外では爆発なしで継続落下のみ
        console.log('✨ 継続落下アニメーション開始（爆発なし）');
        manageContinuousConfetti();
    }
}

// 画面リサイズ時の設定更新
window.addEventListener('resize', function() {
    updateTextAnimationConfig();
    confettiConfig.burstCount = window.innerWidth < 576 ? 40 : window.innerWidth < 768 ? 60 : 80;
    // 継続紙吹雪も更新
    confettiConfig.continuousCount = window.innerWidth < 576 ? 25 : window.innerWidth < 768 ? 35 : 45;
});

// ===============================
// 3. ページローダー
// ===============================
window.addEventListener('load', function() {
    const loader = document.querySelector('.page-loader');
    if (loader) {
        setTimeout(function() {
            loader.style.opacity = '0';
            setTimeout(function() {
                loader.style.display = 'none';
                // ページローダー完了後にテキストアニメーション開始
                initTextAnimations();
                // テキストアニメーションと連動して紙吹雪開始
                initConfettiSystem();
            }, 500);
        }, 500);
    } else {
        // ローダーがない場合は即座に開始
        setTimeout(() => {
            initTextAnimations();
            initConfettiSystem();
        }, 1000);
    }
});

// ===============================
// 4. DOM読み込み完了時の処理
// ===============================
document.addEventListener('DOMContentLoaded', function() {
    // CSSアニメーション注入
    injectAnimationCSS();
    
    // ===============================
    // ヘッダースクロール制御（修正版）
    // ===============================
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    let scrollTimeout;

    // 修正: 初期状態での自動表示を削除
    // setTimeout(() => {
    //     header.classList.add('header-visible');
    // }, 1000);

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // スクロール中は一時的にヘッダーを隠す
        clearTimeout(scrollTimeout);
        
        if (scrollTop > 100) { // スクロールしたらヘッダー表示
            header.classList.add('header-scrolled');
            
            // スクロールが止まったら0.5秒後にヘッダーを表示
            scrollTimeout = setTimeout(() => {
                header.classList.add('header-visible');
            }, 500);
            
        } else {
            // トップに戻ったらヘッダーを隠す
            header.classList.remove('header-scrolled');
            header.classList.remove('header-visible');
        }

        lastScrollTop = scrollTop;
    });

    // ===============================
    // カウントダウンタイマー（修正版）
    // ===============================
    const countdown = document.getElementById('countdown');
    if (countdown) {
        const targetDate = new Date('2025-08-30T11:30:00+09:00').getTime();
        
        function updateCountdown() {
            const now = new Date().getTime();
            const distance = targetDate - now;
            
            if (distance < 0) {
                document.getElementById('days').innerHTML = '00';
                document.getElementById('hours').innerHTML = '00';
                document.getElementById('minutes').innerHTML = '00';
                document.getElementById('seconds').innerHTML = '00';
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            // 修正: 数字変更時のアニメーション削除、シンプルな更新のみ
            function updateSimple(elementId, newValue) {
                const element = document.getElementById(elementId);
                if (!element) return;
                
                const formattedValue = newValue < 10 ? '0' + newValue : newValue.toString();
                element.innerHTML = formattedValue;
            }
            
            updateSimple('days', days);
            updateSimple('hours', hours);
            updateSimple('minutes', minutes);
            updateSimple('seconds', seconds);
        }
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

// ===============================
// モバイルメニュー制御（完全修正版）
// ===============================
const menuToggle = document.querySelector('.menu-toggle');

// シンプルで確実なモバイルナビHTML
const mobileNavHtml = `
    <div class="mobile-nav-overlay" id="mobileNavOverlay" style="display: none;"></div>
    <div class="mobile-nav-sidebar" id="mobileNavSidebar" style="display: none;">
        <div class="mobile-nav-header">
            <img src="images/logo.png" alt="TAKASAGOing! FESTA" class="mobile-logo">
            <button class="mobile-close-btn" id="mobileCloseBtn">
                <span>×</span>
            </button>
        </div>
        <div class="mobile-nav-body">
            <ul class="mobile-menu-list">
                <li><a href="#about">イベント概要</a></li>
                <li><a href="#matsuri">お祭り横丁</a></li>
                <li><a href="#stage">ステージ</a></li>
                <li><a href="#exhibition">展示ブース</a></li>
                <li><a href="#access">アクセス</a></li>
                <li><a href="#faq">よくある質問</a></li>
            </ul>
        </div>
    </div>
`;

if (menuToggle) {
    // 既存のモバイルナビを削除（もしあれば）
    const existingMobileNav = document.querySelector('.mobile-nav');
    if (existingMobileNav) {
        existingMobileNav.remove();
    }
    
    // 新しいモバイルナビを挿入
    document.body.insertAdjacentHTML('beforeend', mobileNavHtml);
    
    // 要素取得
    const overlay = document.getElementById('mobileNavOverlay');
    const sidebar = document.getElementById('mobileNavSidebar');
    const closeBtn = document.getElementById('mobileCloseBtn');
    const menuLinks = document.querySelectorAll('.mobile-menu-list a');
    const entryBtn = document.querySelector('.mobile-entry-button');

    // メニューを開く
    function openMenu() {
        overlay.style.display = 'block';
        sidebar.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // アニメーション
        setTimeout(() => {
            overlay.style.opacity = '1';
            sidebar.style.transform = 'translateX(0)';
        }, 10);
        
        console.log('📱 メニューを開きました');
    }

    // メニューを閉じる
    function closeMenu() {
        overlay.style.opacity = '0';
        sidebar.style.transform = 'translateX(100%)';
        document.body.style.overflow = '';
        
        setTimeout(() => {
            overlay.style.display = 'none';
            sidebar.style.display = 'none';
        }, 300);
        
        console.log('📱 メニューを閉じました');
    }

    // イベントリスナー
    menuToggle.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);
    
    // メニューリンククリック時
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // 参加申込ボタンクリック時
    if (entryBtn) {
        entryBtn.addEventListener('click', closeMenu);
    }
    
    // ESCキーで閉じる
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });
}

    // ===============================
    // スクロールアニメーション
    // ===============================
    const fadeElements = document.querySelectorAll('.section-title, .content-card, .booth-category, .performer, .exhibition-area, .note-item');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                // ランダムな遅延でよりダイナミックに
                const randomDelay = Math.random() * 0.5;
                entry.target.style.animationDelay = `${randomDelay}s`;
            }
        });
    }, observerOptions);
    
    fadeElements.forEach(element => {
        observer.observe(element);
    });

    // ===============================
    // FAQアコーディオン
    // ===============================
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(function(question) {
        question.addEventListener('click', function() {
            const faqItem = this.parentNode;
            const isActive = faqItem.classList.contains('active');
            
            // 一旦すべてのアイテムを閉じる
            document.querySelectorAll('.faq-item').forEach(function(item) {
                item.classList.remove('active');
            });
            
            // クリックしたアイテムのみ開く（既に開いていた場合は閉じる）
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });

    // ===============================
    // 参加申込フォーム送信処理
    // ===============================
    const tigerForm = document.getElementById('tiger-form');
    
    if (tigerForm) {
        tigerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // フォームの入力値を取得
            const formData = {
                company: document.getElementById('company').value,
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                business: document.getElementById('business').value,
                pr: document.getElementById('pr').value
            };
            
            // 通常はここでAPIを呼び出してデータを送信する
            console.log('フォーム送信:', formData);
            
            // 送信成功メッセージ（実際の実装では非同期処理の後に表示する）
            alert('申込が完了しました。確認メールをお送りしますので、ご確認ください。');
            tigerForm.reset();
        });
    }

    // ===============================
    // スムーススクロール
    // ===============================
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
    
    // ===============================
    // ページトップボタンのクリック処理（追加）
    // ===============================
    const pageTopBtn = document.querySelector('.page-top a');
    
    if (pageTopBtn) {
        pageTopBtn.addEventListener('click', function(e) {
            e.preventDefault(); // デフォルト動作を無効化
            
            // スムーズにトップまでスクロール
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ===============================
    // ページトップボタン
    // ===============================
    const pageTop = document.querySelector('.page-top');
    
    if (pageTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                pageTop.classList.add('visible');
            } else {
                pageTop.classList.remove('visible');
            }
        });
    }

    // ===============================
    // イベントギャラリー画像のモーダル表示
    // ===============================
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (galleryItems.length > 0) {
        // モーダルHTMLを追加
        const modalHtml = `
            <div class="gallery-modal">
                <div class="gallery-modal-content">
                    <span class="gallery-modal-close">&times;</span>
                    <img src="" alt="ギャラリー画像" class="gallery-modal-img">
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        const galleryModal = document.querySelector('.gallery-modal');
        const galleryModalImg = document.querySelector('.gallery-modal-img');
        const galleryModalClose = document.querySelector('.gallery-modal-close');
        
        galleryItems.forEach(function(item) {
            item.addEventListener('click', function() {
                const imgSrc = this.querySelector('img').getAttribute('src');
                galleryModalImg.setAttribute('src', imgSrc);
                galleryModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });
        });
        
        galleryModalClose.addEventListener('click', function() {
            galleryModal.style.display = 'none';
            document.body.style.overflow = '';
        });
        
        galleryModal.addEventListener('click', function(e) {
            if (e.target === galleryModal) {
                galleryModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }

    // ===============================
    // マウス追従パーティクル効果（改良版）
    // ===============================
    let mouseX = 0;
    let mouseY = 0;
    
    // パーティクル設定
    const particleColors = ['#f8b500', '#e83a5c', '#33a3dc', '#aacf53', '#f08300'];
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // 生成頻度を上げて、複数のパーティクルを同時生成
        if (Math.random() < 0.08) {
            // メインパーティクル
            createMouseParticle(mouseX, mouseY);
            
            // 追加の小さなパーティクルを周辺に生成
            if (Math.random() < 0.6) {
                const offsetX = (Math.random() - 0.5) * 30;
                const offsetY = (Math.random() - 0.5) * 30;
                createMouseParticle(mouseX + offsetX, mouseY + offsetY, 'small');
            }
        }
    });
    
    function createMouseParticle(x, y, type = 'normal') {
        const particle = document.createElement('div');
        
        // パーティクルのサイズとタイプ設定
        let size, duration, scaleStart;
        if (type === 'small') {
            size = Math.random() * 8 + 6; // 6-14px
            duration = 800;
            scaleStart = 0.8;
        } else {
            size = Math.random() * 12 + 15; // 15-27px（大幅に拡大）
            duration = 1200;
            scaleStart = 1.2;
        }
        
        // ランダムな色を選択
        const color = particleColors[Math.floor(Math.random() * particleColors.length)];
        
        // スタイル設定
        particle.style.position = 'fixed';
        particle.style.left = (x - size/2) + 'px';
        particle.style.top = (y - size/2) + 'px';
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.backgroundColor = color;
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        particle.style.opacity = '0.9';
        particle.style.boxShadow = `0 0 ${size/2}px ${color}40`; // グロー効果
        
        // ランダムな形状バリエーション
        if (Math.random() < 0.3) {
            particle.style.borderRadius = '20%'; // 角丸四角
        } else if (Math.random() < 0.2) {
            particle.style.borderRadius = '50% 10% 50% 10%'; // 花びら型
        }
        
        document.body.appendChild(particle);
        
        // より動的なアニメーション
        const randomAngle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 120 + 60; // 移動距離を拡大
        const moveX = Math.cos(randomAngle) * distance;
        const moveY = Math.sin(randomAngle) * distance;
        const rotation = Math.random() * 720 - 360; // 回転を追加
        
        particle.animate([
            { 
                transform: `translate(0, 0) scale(${scaleStart}) rotate(0deg)`, 
                opacity: 0.9,
                filter: 'blur(0px)'
            },
            { 
                transform: `translate(${moveX * 0.3}px, ${moveY * 0.3}px) scale(${scaleStart * 1.2}) rotate(${rotation * 0.3}deg)`, 
                opacity: 1,
                filter: 'blur(0px)',
                offset: 0.3
            },
            { 
                transform: `translate(${moveX}px, ${moveY}px) scale(0.2) rotate(${rotation}deg)`, 
                opacity: 0,
                filter: 'blur(2px)'
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => particle.remove();
    }
});

// ===============================
// 5. ポップアップバナーの制御（修正版）
// ===============================
document.addEventListener('DOMContentLoaded', function() {
    const popupBanner = document.getElementById('popupBanner');
    const popupClose = document.getElementById('popupClose');
    let hasShownPopup = false;

    // スクロールイベント
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 500 && !hasShownPopup) {
            popupBanner.classList.add('show');
            hasShownPopup = true;
        }
    });

    // 閉じるボタン（修正版）
    if (popupClose) {
        popupClose.addEventListener('click', function(e) {
            // 🔧 重要: イベントの伝播を止めてリンクへの遷移を防ぐ
            e.preventDefault();
            e.stopPropagation();
            
            // ポップアップを非表示
            popupBanner.classList.remove('show');
            
            // デバッグ用ログ
            console.log('ポップアップを閉じました');
        });
    }

    // 🔧 追加: ポップアップ全体をクリックした時の処理を改善
    if (popupBanner) {
        // リンク部分のみクリック可能にする
        const popupLink = popupBanner.querySelector('a');
        if (popupLink) {
            popupLink.addEventListener('click', function(e) {
                // 閉じるボタンがクリックされた場合はリンクを無効化
                if (e.target.closest('.popup-close')) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            });
        }
    }
});
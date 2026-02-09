const I18n = {
    translations: {},
    currentLanguage: 'en',

    init: function() {
        // 绑定语言选择事件
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.changeLanguage(e.target.value);
            });
        }

        // 从本地存储加载保存的语言
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
            this.loadLanguage(savedLanguage);
            languageSelect.value = savedLanguage;
        } else {
            // 检测系统语言
            const systemLanguage = navigator.language || navigator.userLanguage;
            const langCode = systemLanguage.substring(0, 2); // 提取语言代码的前两个字符
            
            // 检查是否支持该语言
            const supportedLanguages = ['en', 'zh'];
            if (supportedLanguages.includes(langCode)) {
                this.loadLanguage(langCode);
                languageSelect.value = langCode;
            } else {
                // 使用默认语言
                this.loadLanguage('en');
                languageSelect.value = 'en';
            }
        }
    },

    loadLanguage: function(lang) {
        fetch(`lang/${lang}.json`) 
            .then(response => response.json())
            .then(data => {
                this.translations[lang] = data;
                this.currentLanguage = lang;
                this.updateContent();
            })
            .catch(error => {
                console.error('Error loading translation file:', error);
            });
    },

    changeLanguage: function(lang) {
        if (!this.translations[lang]) {
            this.loadLanguage(lang);
        } else {
            this.currentLanguage = lang;
            this.updateContent();
        }
        // 保存语言设置到本地存储
        localStorage.setItem('language', lang);
    },

    updateContent: function() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (this.translations[this.currentLanguage] && this.translations[this.currentLanguage][key]) {
                element.textContent = this.translations[this.currentLanguage][key];
            }
        });

        // 更新页面标题
        const titleElement = document.querySelector('title[data-i18n]');
        if (titleElement) {
            const key = titleElement.getAttribute('data-i18n');
            if (this.translations[this.currentLanguage] && this.translations[this.currentLanguage][key]) {
                document.title = this.translations[this.currentLanguage][key];
            }
        }
    }
};

// 页面加载完成后初始化国际化
window.addEventListener('DOMContentLoaded', function() {
    I18n.init();
});
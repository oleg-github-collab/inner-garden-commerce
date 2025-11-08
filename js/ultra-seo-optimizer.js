class UltraSEOOptimizer {
    constructor() {
        this.seoMetrics = {
            score: 0,
            issues: [],
            improvements: [],
            coreWebVitals: {},
            technicalSEO: {},
            contentSEO: {},
            accessibility: {}
        };

        this.recommendations = [];
        this.optimizations = new Map();

        this.seoRules = {
            title: { minLength: 30, maxLength: 60 },
            description: { minLength: 120, maxLength: 160 },
            h1: { required: true, maxCount: 1 },
            images: { requireAlt: true, maxSize: 500000 },
            links: { requireTitle: true, checkBroken: true },
            schema: { required: true },
            sitemap: { required: true },
            robots: { required: true }
        };

        this.init();
    }

    init() {
        console.log('🚀 SEO Optimization System activated');
        this.analyzeTechnicalSEO();
        this.analyzeContentSEO();
        this.analyzeCoreWebVitals();
        this.analyzeAccessibility();
        this.implementSEOEnhancements();
        this.setupRealTimeMonitoring();
    }

    analyzeTechnicalSEO() {
        console.log('🔧 Analyzing Technical SEO');

        this.seoMetrics.technicalSEO = {
            metaTags: this.analyzeMetaTags(),
            headings: this.analyzeHeadings(),
            images: this.analyzeImages(),
            links: this.analyzeLinks(),
            performance: this.analyzePerformance(),
            mobile: this.analyzeMobileFriendliness(),
            security: this.analyzeSecurityFeatures(),
            structuredData: this.analyzeStructuredData()
        };

        this.generateTechnicalSEOScore();
    }

    analyzeMetaTags() {
        const metaAnalysis = {
            title: this.analyzeTitle(),
            description: this.analyzeDescription(),
            keywords: this.analyzeKeywords(),
            viewport: this.analyzeViewport(),
            charset: this.analyzeCharset(),
            openGraph: this.analyzeOpenGraph(),
            twitter: this.analyzeTwitterCards(),
            canonical: this.analyzeCanonical()
        };

        this.optimizeMetaTags(metaAnalysis);
        return metaAnalysis;
    }

    analyzeTitle() {
        const titleTag = document.querySelector('title');
        const title = titleTag ? titleTag.textContent.trim() : '';

        const analysis = {
            present: !!titleTag,
            content: title,
            length: title.length,
            valid: title.length >= this.seoRules.title.minLength &&
                   title.length <= this.seoRules.title.maxLength,
            issues: []
        };

        if (!analysis.present) {
            analysis.issues.push('Missing title tag');
        } else if (analysis.length < this.seoRules.title.minLength) {
            analysis.issues.push('Title too short');
        } else if (analysis.length > this.seoRules.title.maxLength) {
            analysis.issues.push('Title too long');
        }

        return analysis;
    }

    analyzeDescription() {
        const descTag = document.querySelector('meta[name="description"]');
        const description = descTag ? descTag.getAttribute('content') : '';

        const analysis = {
            present: !!descTag,
            content: description,
            length: description.length,
            valid: description.length >= this.seoRules.description.minLength &&
                   description.length <= this.seoRules.description.maxLength,
            issues: []
        };

        if (!analysis.present) {
            analysis.issues.push('Missing meta description');
        } else if (analysis.length < this.seoRules.description.minLength) {
            analysis.issues.push('Description too short');
        } else if (analysis.length > this.seoRules.description.maxLength) {
            analysis.issues.push('Description too long');
        }

        return analysis;
    }

    analyzeHeadings() {
        const headings = {
            h1: document.querySelectorAll('h1'),
            h2: document.querySelectorAll('h2'),
            h3: document.querySelectorAll('h3'),
            h4: document.querySelectorAll('h4'),
            h5: document.querySelectorAll('h5'),
            h6: document.querySelectorAll('h6')
        };

        const analysis = {
            structure: this.analyzeHeadingStructure(headings),
            h1Count: headings.h1.length,
            hierarchy: this.checkHeadingHierarchy(headings),
            content: this.analyzeHeadingContent(headings),
            issues: []
        };

        if (analysis.h1Count === 0) {
            analysis.issues.push('Missing H1 tag');
        } else if (analysis.h1Count > 1) {
            analysis.issues.push('Multiple H1 tags found');
        }

        if (!analysis.hierarchy.valid) {
            analysis.issues.push('Invalid heading hierarchy');
        }

        return analysis;
    }

    analyzeImages() {
        const images = document.querySelectorAll('img');
        const analysis = {
            total: images.length,
            withAlt: 0,
            withoutAlt: 0,
            oversized: 0,
            optimized: 0,
            issues: [],
            details: []
        };

        images.forEach((img, index) => {
            const imgAnalysis = {
                index: index,
                src: img.src,
                alt: img.alt,
                hasAlt: !!img.alt && img.alt.trim() !== '',
                loading: img.loading,
                width: img.naturalWidth,
                height: img.naturalHeight,
                fileSize: null
            };

            if (imgAnalysis.hasAlt) {
                analysis.withAlt++;
            } else {
                analysis.withoutAlt++;
                analysis.issues.push(`Image ${index + 1} missing alt text`);
            }

            if (imgAnalysis.width * imgAnalysis.height > 2073600) {
                analysis.oversized++;
                analysis.issues.push(`Image ${index + 1} is oversized`);
            }

            if (img.loading === 'lazy') {
                analysis.optimized++;
            }

            analysis.details.push(imgAnalysis);
        });

        return analysis;
    }

    analyzeLinks() {
        const links = document.querySelectorAll('a');
        const analysis = {
            total: links.length,
            internal: 0,
            external: 0,
            withTitle: 0,
            withoutTitle: 0,
            broken: 0,
            nofollow: 0,
            issues: [],
            details: []
        };

        links.forEach((link, index) => {
            const href = link.href;
            const isInternal = href.includes(window.location.hostname) || href.startsWith('/') || href.startsWith('#');
            const hasTitle = !!link.title;
            const rel = link.rel;

            const linkAnalysis = {
                index: index,
                href: href,
                text: link.textContent.trim(),
                title: link.title,
                isInternal: isInternal,
                hasTitle: hasTitle,
                rel: rel,
                nofollow: rel.includes('nofollow')
            };

            if (isInternal) {
                analysis.internal++;
            } else {
                analysis.external++;
            }

            if (hasTitle) {
                analysis.withTitle++;
            } else {
                analysis.withoutTitle++;
                if (!isInternal) {
                    analysis.issues.push(`External link ${index + 1} missing title`);
                }
            }

            if (linkAnalysis.nofollow) {
                analysis.nofollow++;
            }

            analysis.details.push(linkAnalysis);
        });

        return analysis;
    }

    analyzeCoreWebVitals() {
        console.log('⚡ Analyzing Core Web Vitals');

        this.seoMetrics.coreWebVitals = {
            lcp: this.measureLCP(),
            fid: this.measureFID(),
            cls: this.measureCLS(),
            fcp: this.measureFCP(),
            ttfb: this.measureTTFB()
        };

        this.optimizeCoreWebVitals();
    }

    measureLCP() {
        return new Promise((resolve) => {
            if ('PerformanceObserver' in window) {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];

                    resolve({
                        value: lastEntry.startTime,
                        rating: this.rateLCP(lastEntry.startTime),
                        element: lastEntry.element
                    });
                });

                observer.observe({ entryTypes: ['largest-contentful-paint'] });

                setTimeout(() => {
                    observer.disconnect();
                    resolve({ value: null, rating: 'unknown', element: null });
                }, 5000);
            } else {
                resolve({ value: null, rating: 'unsupported', element: null });
            }
        });
    }

    measureFID() {
        return new Promise((resolve) => {
            if ('PerformanceObserver' in window) {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const firstEntry = entries[0];

                    resolve({
                        value: firstEntry.processingStart - firstEntry.startTime,
                        rating: this.rateFID(firstEntry.processingStart - firstEntry.startTime)
                    });
                });

                observer.observe({ entryTypes: ['first-input'] });

                setTimeout(() => {
                    observer.disconnect();
                    resolve({ value: null, rating: 'no-interaction' });
                }, 10000);
            } else {
                resolve({ value: null, rating: 'unsupported' });
            }
        });
    }

    measureCLS() {
        return new Promise((resolve) => {
            if ('PerformanceObserver' in window) {
                let clsValue = 0;
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    }
                });

                observer.observe({ entryTypes: ['layout-shift'] });

                setTimeout(() => {
                    observer.disconnect();
                    resolve({
                        value: clsValue,
                        rating: this.rateCLS(clsValue)
                    });
                }, 5000);
            } else {
                resolve({ value: null, rating: 'unsupported' });
            }
        });
    }

    analyzeContentSEO() {
        console.log('📝 Analyzing Content SEO');

        this.seoMetrics.contentSEO = {
            wordCount: this.analyzeWordCount(),
            readability: this.analyzeReadability(),
            keywords: this.analyzeKeywordDensity(),
            uniqueness: this.analyzeContentUniqueness(),
            structure: this.analyzeContentStructure()
        };
    }

    analyzeWordCount() {
        const textContent = document.body.textContent || '';
        const words = textContent.trim().split(/\s+/).filter(word => word.length > 0);

        return {
            total: words.length,
            rating: words.length >= 300 ? 'good' : words.length >= 150 ? 'fair' : 'poor',
            recommendation: words.length < 300 ? 'Add more content (minimum 300 words recommended)' : null
        };
    }

    analyzeReadability() {
        const textContent = document.body.textContent || '';
        const sentences = textContent.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const words = textContent.trim().split(/\s+/).filter(word => word.length > 0);
        const syllables = this.countSyllables(textContent);

        const avgWordsPerSentence = words.length / sentences.length;
        const avgSyllablesPerWord = syllables / words.length;

        const fleschScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);

        return {
            fleschScore: Math.round(fleschScore),
            rating: this.rateReadability(fleschScore),
            avgWordsPerSentence: Math.round(avgWordsPerSentence),
            avgSyllablesPerWord: Math.round(avgSyllablesPerWord * 100) / 100
        };
    }

    implementSEOEnhancements() {
        console.log('🔧 Implementing SEO Enhancements');

        this.addMissingMetaTags();
        this.optimizeImages();
        this.addStructuredData();
        this.implementLazyLoading();
        this.addSitemapAndRobots();
        this.optimizePerformance();
    }

    addMissingMetaTags() {
        if (!document.querySelector('meta[name="viewport"]')) {
            const viewport = document.createElement('meta');
            viewport.name = 'viewport';
            viewport.content = 'width=device-width, initial-scale=1.0';
            document.head.appendChild(viewport);
            this.recommendations.push('Added viewport meta tag');
        }

        if (!document.querySelector('meta[charset]') && !document.querySelector('meta[http-equiv="Content-Type"]')) {
            const charset = document.createElement('meta');
            charset.charset = 'UTF-8';
            document.head.insertBefore(charset, document.head.firstChild);
            this.recommendations.push('Added charset meta tag');
        }

        if (!document.querySelector('meta[name="description"]')) {
            const description = document.createElement('meta');
            description.name = 'description';
            description.content = 'Inner Garden Commerce - Премиальные картины с AR примеркой для вашего дома';
            document.head.appendChild(description);
            this.recommendations.push('Added meta description');
        }

        this.addOpenGraphTags();
        this.addTwitterCardTags();
    }

    addOpenGraphTags() {
        const ogTags = [
            { property: 'og:type', content: 'website' },
            { property: 'og:title', content: document.title || 'Inner Garden Commerce' },
            { property: 'og:description', content: 'Премиальные картины с AR примеркой для вашего дома' },
            { property: 'og:url', content: window.location.href },
            { property: 'og:site_name', content: 'Inner Garden Commerce' },
            { property: 'og:image', content: window.location.origin + '/images/og-image.jpg' },
            { property: 'og:image:width', content: '1200' },
            { property: 'og:image:height', content: '630' },
            { property: 'og:locale', content: 'uk_UA' }
        ];

        ogTags.forEach(tag => {
            if (!document.querySelector(`meta[property="${tag.property}"]`)) {
                const meta = document.createElement('meta');
                meta.setAttribute('property', tag.property);
                meta.content = tag.content;
                document.head.appendChild(meta);
            }
        });
    }

    addTwitterCardTags() {
        const twitterTags = [
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: document.title || 'Inner Garden Commerce' },
            { name: 'twitter:description', content: 'Премиальні картини з AR приміркою для вашого дому' },
            { name: 'twitter:image', content: window.location.origin + '/images/twitter-card.jpg' }
        ];

        twitterTags.forEach(tag => {
            if (!document.querySelector(`meta[name="${tag.name}"]`)) {
                const meta = document.createElement('meta');
                meta.name = tag.name;
                meta.content = tag.content;
                document.head.appendChild(meta);
            }
        });
    }

    optimizeImages() {
        const images = document.querySelectorAll('img:not([alt])');
        images.forEach((img, index) => {
            img.alt = `Image ${index + 1} - Inner Garden Commerce`;
        });

        const lazyImages = document.querySelectorAll('img:not([loading])');
        lazyImages.forEach(img => {
            img.loading = 'lazy';
        });

        this.recommendations.push(`Optimized ${images.length} images with missing alt text`);
        this.recommendations.push(`Added lazy loading to ${lazyImages.length} images`);
    }

    addStructuredData() {
        if (!document.querySelector('script[type="application/ld+json"]')) {
            const structuredData = {
                "@context": "https://schema.org",
                "@type": "Store",
                "name": "Inner Garden Commerce",
                "description": "Премиальні картини з AR приміркою для вашого дому",
                "url": window.location.origin,
                "@id": window.location.origin,
                "logo": window.location.origin + "/images/logo.png",
                "image": window.location.origin + "/images/og-image.jpg",
                "telephone": "+380-XX-XXX-XXXX",
                "address": {
                    "@type": "PostalAddress",
                    "addressCountry": "UA",
                    "addressLocality": "Київ"
                },
                "openingHours": "Mo-Su 09:00-21:00",
                "paymentAccepted": ["Cash", "Credit Card", "PayPal"],
                "priceRange": "$$",
                "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Картини",
                    "itemListElement": [
                        {
                            "@type": "Offer",
                            "itemOffered": {
                                "@type": "Product",
                                "name": "Преміальні картини",
                                "description": "Ексклюзивні картини з можливістю AR примірки"
                            }
                        }
                    ]
                }
            };

            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(structuredData, null, 2);
            document.head.appendChild(script);

            this.recommendations.push('Added structured data (JSON-LD)');
        }
    }

    addSitemapAndRobots() {
        if (!document.querySelector('link[rel="sitemap"]')) {
            const sitemap = document.createElement('link');
            sitemap.rel = 'sitemap';
            sitemap.type = 'application/xml';
            sitemap.href = '/sitemap.xml';
            document.head.appendChild(sitemap);
        }

        if (!document.querySelector('meta[name="robots"]')) {
            const robots = document.createElement('meta');
            robots.name = 'robots';
            robots.content = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
            document.head.appendChild(robots);
        }
    }

    setupRealTimeMonitoring() {
        this.setupPerformanceObserver();
        this.setupMutationObserver();
        this.scheduleRegularAnalysis();
    }

    setupPerformanceObserver() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.entryType === 'navigation') {
                        this.analyzePageLoadMetrics(entry);
                    }
                });
            });

            observer.observe({ entryTypes: ['navigation', 'resource'] });
        }
    }

    setupMutationObserver() {
        if ('MutationObserver' in window) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                this.optimizeNewContent(node);
                            }
                        });
                    }
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    optimizeNewContent(element) {
        const images = element.querySelectorAll ? element.querySelectorAll('img') : [];
        images.forEach(img => {
            if (!img.alt) {
                img.alt = 'Динамічно додане зображення';
            }
            if (!img.loading) {
                img.loading = 'lazy';
            }
        });
    }

    scheduleRegularAnalysis() {
        setInterval(() => {
            this.updateSEOMetrics();
        }, 300000);
    }

    updateSEOMetrics() {
        this.analyzeTechnicalSEO();
        this.generateSEOScore();
    }

    generateSEOScore() {
        let score = 100;
        let issues = 0;

        if (!this.seoMetrics.technicalSEO.metaTags.title.valid) {
            score -= 15;
            issues++;
        }

        if (!this.seoMetrics.technicalSEO.metaTags.description.valid) {
            score -= 15;
            issues++;
        }

        if (this.seoMetrics.technicalSEO.headings.h1Count !== 1) {
            score -= 10;
            issues++;
        }

        if (this.seoMetrics.technicalSEO.images.withoutAlt > 0) {
            score -= Math.min(20, this.seoMetrics.technicalSEO.images.withoutAlt * 2);
            issues++;
        }

        this.seoMetrics.score = Math.max(0, score);
        this.seoMetrics.issues = issues;

        console.log(`🎯 SEO Score: ${this.seoMetrics.score}/100 (${issues} issues)`);
    }

    generateComprehensiveReport() {
        const report = {
            timestamp: new Date().toISOString(),
            score: this.seoMetrics.score,
            grade: this.getSEOGrade(this.seoMetrics.score),
            issues: this.seoMetrics.issues,
            technicalSEO: this.seoMetrics.technicalSEO,
            contentSEO: this.seoMetrics.contentSEO,
            coreWebVitals: this.seoMetrics.coreWebVitals,
            recommendations: this.recommendations,
            optimizations: Array.from(this.optimizations.entries())
        };

        console.log('📊 Comprehensive SEO Report:', report);
        this.displaySEOReport(report);
        return report;
    }

    displaySEOReport(report) {
        const style = `
            position: fixed; bottom: 20px; right: 20px; width: 400px; max-height: 80vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; border-radius: 15px; padding: 20px; font-family: 'Segoe UI', sans-serif;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3); z-index: 10002; overflow-y: auto;
            border: 1px solid rgba(255,255,255,0.2);
        `;

        const panel = document.createElement('div');
        panel.style.cssText = style;
        panel.innerHTML = `
            <h3 style="margin: 0 0 15px 0; color: #fff; font-size: 18px;">
                🚀 SEO Optimization Report
            </h3>
            <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                <h4 style="margin: 0 0 10px 0;">SEO Score: ${report.score}/100 (${report.grade})</h4>
                <div style="background: rgba(255,255,255,0.2); height: 8px; border-radius: 4px;">
                    <div style="background: ${this.getScoreColor(report.score)}; height: 100%; width: ${report.score}%; border-radius: 4px;"></div>
                </div>
            </div>
            <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                <h4 style="margin: 0 0 10px 0;">Issues Found: ${report.issues}</h4>
                <div style="font-size: 12px;">
                    <div>Title: ${report.technicalSEO.metaTags.title.valid ? '✅' : '❌'}</div>
                    <div>Description: ${report.technicalSEO.metaTags.description.valid ? '✅' : '❌'}</div>
                    <div>H1: ${report.technicalSEO.headings.h1Count === 1 ? '✅' : '❌'}</div>
                    <div>Images: ${report.technicalSEO.images.withoutAlt === 0 ? '✅' : '❌'}</div>
                </div>
            </div>
            <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                <h4 style="margin: 0 0 10px 0;">Recommendations: ${report.recommendations.length}</h4>
                <div style="max-height: 100px; overflow-y: auto; font-size: 12px;">
                    ${report.recommendations.slice(0, 3).map(rec => `<div style="margin-bottom: 4px;">• ${rec}</div>`).join('')}
                </div>
            </div>
            <button onclick="this.parentElement.remove()" style="
                background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px 16px;
                border-radius: 6px; cursor: pointer; width: 100%; margin-top: 10px;
            ">Close Report</button>
        `;

        document.body.appendChild(panel);

        setTimeout(() => {
            if (panel.parentElement) {
                panel.remove();
            }
        }, 60000);
    }

    getSEOGrade(score) {
        if (score >= 90) return 'A+';
        if (score >= 80) return 'A';
        if (score >= 70) return 'B';
        if (score >= 60) return 'C';
        if (score >= 50) return 'D';
        return 'F';
    }

    getScoreColor(score) {
        if (score >= 80) return '#4CAF50';
        if (score >= 60) return '#FF9800';
        return '#F44336';
    }

    rateLCP(value) {
        if (value <= 2500) return 'good';
        if (value <= 4000) return 'needs-improvement';
        return 'poor';
    }

    rateFID(value) {
        if (value <= 100) return 'good';
        if (value <= 300) return 'needs-improvement';
        return 'poor';
    }

    rateCLS(value) {
        if (value <= 0.1) return 'good';
        if (value <= 0.25) return 'needs-improvement';
        return 'poor';
    }

    rateReadability(score) {
        if (score >= 60) return 'good';
        if (score >= 30) return 'fair';
        return 'poor';
    }

    countSyllables(text) {
        const words = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
        return words.reduce((count, word) => {
            const syllables = word.match(/[aeiouy]+/g);
            return count + (syllables ? syllables.length : 1);
        }, 0);
    }

    destroy() {
        console.log('🚀 SEO Optimization System deactivated');
    }
}

if (typeof window !== 'undefined') {
    window.UltraSEOOptimizer = UltraSEOOptimizer;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.seoOptimizer = new UltraSEOOptimizer();
        });
    } else {
        window.seoOptimizer = new UltraSEOOptimizer();
    }
}
class UltraMemoryLeakPreventer {
    constructor() {
        this.memoryStats = {
            initial: 0,
            current: 0,
            peak: 0,
            leaks: [],
            warnings: []
        };

        this.monitors = {
            eventListeners: new WeakMap(),
            timers: new Set(),
            observers: new Set(),
            references: new WeakMap(),
            domNodes: new WeakSet()
        };

        this.thresholds = {
            memoryIncrease: 50 * 1024 * 1024,
            eventListenerCount: 1000,
            timerCount: 100,
            domNodeCount: 10000
        };

        this.cleanupTasks = new Set();
        this.isMonitoring = false;

        this.init();
    }

    init() {
        console.log('🛡️ Memory Leak Prevention System activated');
        this.recordInitialMemory();
        this.setupMemoryMonitoring();
        this.interceptLeakyAPIs();
        this.setupAutomaticCleanup();
        this.startContinuousMonitoring();
    }

    recordInitialMemory() {
        if (performance.memory) {
            this.memoryStats.initial = performance.memory.usedJSHeapSize;
            this.memoryStats.current = performance.memory.usedJSHeapSize;
            this.memoryStats.peak = performance.memory.usedJSHeapSize;
        }
    }

    setupMemoryMonitoring() {
        if (typeof PerformanceObserver !== 'undefined') {
            try {
                this.memoryObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        if (entry.entryType === 'measure' || entry.entryType === 'memory') {
                            this.analyzeMemoryUsage();
                        }
                    });
                });

                this.memoryObserver.observe({ entryTypes: ['measure'] });
            } catch (error) {
                console.warn('PerformanceObserver not fully supported:', error);
            }
        }
    }

    interceptLeakyAPIs() {
        this.interceptEventListeners();
        this.interceptTimers();
        this.interceptObservers();
        this.interceptDOMManipulation();
        this.interceptXHRAndFetch();
    }

    interceptEventListeners() {
        const originalAddEventListener = EventTarget.prototype.addEventListener;
        const originalRemoveEventListener = EventTarget.prototype.removeEventListener;
        const self = this;

        EventTarget.prototype.addEventListener = function(type, listener, options) {
            if (!self.monitors.eventListeners.has(this)) {
                self.monitors.eventListeners.set(this, new Map());
            }

            const listenerMap = self.monitors.eventListeners.get(this);
            if (!listenerMap.has(type)) {
                listenerMap.set(type, new Set());
            }

            listenerMap.get(type).add({
                listener: listener,
                options: options,
                added: Date.now(),
                stack: self.captureStack()
            });

            self.checkEventListenerThreshold();

            return originalAddEventListener.call(this, type, listener, options);
        };

        EventTarget.prototype.removeEventListener = function(type, listener, options) {
            if (self.monitors.eventListeners.has(this)) {
                const listenerMap = self.monitors.eventListeners.get(this);
                if (listenerMap.has(type)) {
                    const listeners = listenerMap.get(type);
                    listeners.forEach(item => {
                        if (item.listener === listener) {
                            listeners.delete(item);
                        }
                    });

                    if (listeners.size === 0) {
                        listenerMap.delete(type);
                    }
                }
            }

            return originalRemoveEventListener.call(this, type, listener, options);
        };
    }

    interceptTimers() {
        const originalSetTimeout = window.setTimeout;
        const originalSetInterval = window.setInterval;
        const originalClearTimeout = window.clearTimeout;
        const originalClearInterval = window.clearInterval;
        const self = this;

        window.setTimeout = function(callback, delay, ...args) {
            const id = originalSetTimeout.call(this, callback, delay, ...args);

            self.monitors.timers.add({
                id: id,
                type: 'timeout',
                callback: callback,
                delay: delay,
                created: Date.now(),
                stack: self.captureStack()
            });

            self.checkTimerThreshold();
            return id;
        };

        window.setInterval = function(callback, delay, ...args) {
            const id = originalSetInterval.call(this, callback, delay, ...args);

            self.monitors.timers.add({
                id: id,
                type: 'interval',
                callback: callback,
                delay: delay,
                created: Date.now(),
                stack: self.captureStack()
            });

            self.checkTimerThreshold();
            return id;
        };

        window.clearTimeout = function(id) {
            self.monitors.timers.forEach(timer => {
                if (timer.id === id) {
                    self.monitors.timers.delete(timer);
                }
            });

            return originalClearTimeout.call(this, id);
        };

        window.clearInterval = function(id) {
            self.monitors.timers.forEach(timer => {
                if (timer.id === id) {
                    self.monitors.timers.delete(timer);
                }
            });

            return originalClearInterval.call(this, id);
        };
    }

    interceptObservers() {
        const self = this;

        if (typeof MutationObserver !== 'undefined') {
            const OriginalMutationObserver = window.MutationObserver;

            window.MutationObserver = function(callback) {
                const observer = new OriginalMutationObserver(callback);
                self.monitors.observers.add({
                    observer: observer,
                    type: 'mutation',
                    created: Date.now(),
                    stack: self.captureStack()
                });

                const originalDisconnect = observer.disconnect;
                observer.disconnect = function() {
                    self.monitors.observers.forEach(item => {
                        if (item.observer === observer) {
                            self.monitors.observers.delete(item);
                        }
                    });
                    return originalDisconnect.call(this);
                };

                return observer;
            };
        }

        if (typeof IntersectionObserver !== 'undefined') {
            const OriginalIntersectionObserver = window.IntersectionObserver;

            window.IntersectionObserver = function(callback, options) {
                const observer = new OriginalIntersectionObserver(callback, options);
                self.monitors.observers.add({
                    observer: observer,
                    type: 'intersection',
                    created: Date.now(),
                    stack: self.captureStack()
                });

                const originalDisconnect = observer.disconnect;
                observer.disconnect = function() {
                    self.monitors.observers.forEach(item => {
                        if (item.observer === observer) {
                            self.monitors.observers.delete(item);
                        }
                    });
                    return originalDisconnect.call(this);
                };

                return observer;
            };
        }
    }

    interceptDOMManipulation() {
        const self = this;
        const originalAppendChild = Node.prototype.appendChild;
        const originalRemoveChild = Node.prototype.removeChild;
        const originalInsertBefore = Node.prototype.insertBefore;

        Node.prototype.appendChild = function(newChild) {
            self.monitors.domNodes.add(newChild);
            self.checkDOMNodeThreshold();
            return originalAppendChild.call(this, newChild);
        };

        Node.prototype.removeChild = function(oldChild) {
            self.monitors.domNodes.delete(oldChild);
            return originalRemoveChild.call(this, oldChild);
        };

        Node.prototype.insertBefore = function(newChild, referenceChild) {
            self.monitors.domNodes.add(newChild);
            self.checkDOMNodeThreshold();
            return originalInsertBefore.call(this, newChild, referenceChild);
        };
    }

    interceptXHRAndFetch() {
        const self = this;
        const originalXHR = window.XMLHttpRequest;
        const originalFetch = window.fetch;

        window.XMLHttpRequest = function() {
            const xhr = new originalXHR();
            const cleanup = () => {
                xhr.removeEventListener('load', cleanup);
                xhr.removeEventListener('error', cleanup);
                xhr.removeEventListener('abort', cleanup);
            };

            xhr.addEventListener('load', cleanup);
            xhr.addEventListener('error', cleanup);
            xhr.addEventListener('abort', cleanup);

            return xhr;
        };

        if (originalFetch) {
            window.fetch = function(...args) {
                const promise = originalFetch.apply(this, args);

                promise.catch(() => {}).finally(() => {
                    self.scheduleGarbageCollection();
                });

                return promise;
            };
        }
    }

    setupAutomaticCleanup() {
        this.cleanupTasks.add(() => this.cleanupEventListeners());
        this.cleanupTasks.add(() => this.cleanupTimers());
        this.cleanupTasks.add(() => this.cleanupObservers());
        this.cleanupTasks.add(() => this.cleanupDOMReferences());

        window.addEventListener('beforeunload', () => {
            this.performEmergencyCleanup();
        });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.performPartialCleanup();
            }
        });
    }

    cleanupEventListeners() {
        const now = Date.now();
        const maxAge = 5 * 60 * 1000;

        this.monitors.eventListeners.forEach((listenerMap, target) => {
            listenerMap.forEach((listeners, type) => {
                listeners.forEach(item => {
                    if (now - item.added > maxAge) {
                        target.removeEventListener(type, item.listener, item.options);
                        listeners.delete(item);

                        this.memoryStats.warnings.push({
                            type: 'EventListener Cleanup',
                            target: target.tagName || target.constructor.name,
                            eventType: type,
                            age: now - item.added,
                            timestamp: now
                        });
                    }
                });
            });
        });
    }

    cleanupTimers() {
        const now = Date.now();
        const maxAge = 10 * 60 * 1000;

        this.monitors.timers.forEach(timer => {
            if (now - timer.created > maxAge && timer.type === 'interval') {
                clearInterval(timer.id);
                this.monitors.timers.delete(timer);

                this.memoryStats.warnings.push({
                    type: 'Timer Cleanup',
                    timerType: timer.type,
                    age: now - timer.created,
                    timestamp: now
                });
            }
        });
    }

    cleanupObservers() {
        const now = Date.now();
        const maxAge = 15 * 60 * 1000;

        this.monitors.observers.forEach(item => {
            if (now - item.created > maxAge) {
                if (item.observer && typeof item.observer.disconnect === 'function') {
                    item.observer.disconnect();
                    this.monitors.observers.delete(item);

                    this.memoryStats.warnings.push({
                        type: 'Observer Cleanup',
                        observerType: item.type,
                        age: now - item.created,
                        timestamp: now
                    });
                }
            }
        });
    }

    cleanupDOMReferences() {
        if (typeof window.gc === 'function') {
            window.gc();
        } else {
            this.scheduleGarbageCollection();
        }
    }

    startContinuousMonitoring() {
        this.isMonitoring = true;

        this.monitoringInterval = setInterval(() => {
            this.analyzeMemoryUsage();
            this.detectMemoryLeaks();
            this.performMaintenanceCleanup();
        }, 30000);

        this.deepAnalysisInterval = setInterval(() => {
            this.performDeepMemoryAnalysis();
        }, 300000);
    }

    analyzeMemoryUsage() {
        if (!performance.memory) return;

        const current = performance.memory.usedJSHeapSize;
        const total = performance.memory.totalJSHeapSize;
        const limit = performance.memory.jsHeapSizeLimit;

        this.memoryStats.current = current;
        if (current > this.memoryStats.peak) {
            this.memoryStats.peak = current;
        }

        const memoryIncrease = current - this.memoryStats.initial;

        if (memoryIncrease > this.thresholds.memoryIncrease) {
            this.detectPotentialLeak();
        }

        if (current / limit > 0.9) {
            this.handleCriticalMemoryUsage();
        }

        this.logMemoryStats({
            current: this.formatBytes(current),
            peak: this.formatBytes(this.memoryStats.peak),
            increase: this.formatBytes(memoryIncrease),
            utilizationPercent: Math.round((current / limit) * 100)
        });
    }

    detectMemoryLeaks() {
        const potentialLeaks = [];

        if (this.monitors.eventListeners.size > this.thresholds.eventListenerCount) {
            potentialLeaks.push({
                type: 'Event Listeners',
                count: this.monitors.eventListeners.size,
                severity: 'high'
            });
        }

        if (this.monitors.timers.size > this.thresholds.timerCount) {
            potentialLeaks.push({
                type: 'Timers',
                count: this.monitors.timers.size,
                severity: 'medium'
            });
        }

        if (this.monitors.observers.size > 50) {
            potentialLeaks.push({
                type: 'Observers',
                count: this.monitors.observers.size,
                severity: 'medium'
            });
        }

        if (potentialLeaks.length > 0) {
            this.memoryStats.leaks.push({
                timestamp: Date.now(),
                leaks: potentialLeaks,
                memoryUsage: performance.memory ? performance.memory.usedJSHeapSize : 0
            });

            console.warn('🚨 Potential memory leaks detected:', potentialLeaks);
            this.performEmergencyCleanup();
        }
    }

    detectPotentialLeak() {
        const stackTraces = this.gatherStackTraces();
        const suspiciousPatterns = this.analyzeSuspiciousPatterns();

        this.memoryStats.leaks.push({
            timestamp: Date.now(),
            type: 'Memory Growth',
            increase: this.memoryStats.current - this.memoryStats.initial,
            stackTraces: stackTraces,
            patterns: suspiciousPatterns
        });

        console.warn('🚨 Potential memory leak detected due to excessive growth');
    }

    handleCriticalMemoryUsage() {
        console.error('🚨 Critical memory usage detected!');

        this.performEmergencyCleanup();

        if (typeof window.gc === 'function') {
            window.gc();
        }

        this.cleanupTasks.forEach(task => {
            try {
                task();
            } catch (error) {
                console.error('Cleanup task failed:', error);
            }
        });
    }

    performMaintenanceCleanup() {
        this.cleanupTasks.forEach(task => {
            try {
                task();
            } catch (error) {
                console.warn('Maintenance cleanup task failed:', error);
            }
        });
    }

    performEmergencyCleanup() {
        console.log('🛡️ Performing emergency memory cleanup');

        this.cleanupEventListeners();
        this.cleanupTimers();
        this.cleanupObservers();
        this.cleanupDOMReferences();

        this.scheduleGarbageCollection();
    }

    performPartialCleanup() {
        console.log('🛡️ Performing partial cleanup (page hidden)');

        const ageThreshold = 30000;
        const now = Date.now();

        this.monitors.timers.forEach(timer => {
            if (timer.type === 'interval' && (now - timer.created) > ageThreshold) {
                clearInterval(timer.id);
                this.monitors.timers.delete(timer);
            }
        });
    }

    performDeepMemoryAnalysis() {
        console.log('🔍 Performing deep memory analysis');

        const analysis = {
            eventListeners: this.analyzeEventListeners(),
            timers: this.analyzeTimers(),
            observers: this.analyzeObservers(),
            domNodes: this.analyzeDOMNodes(),
            recommendations: []
        };

        if (analysis.eventListeners.orphaned > 10) {
            analysis.recommendations.push('Remove orphaned event listeners');
        }

        if (analysis.timers.longRunning > 5) {
            analysis.recommendations.push('Clear long-running intervals');
        }

        console.log('📊 Deep Memory Analysis:', analysis);
        return analysis;
    }

    analyzeEventListeners() {
        let total = 0;
        let orphaned = 0;

        this.monitors.eventListeners.forEach((listenerMap, target) => {
            if (!document.contains(target) && target !== window && target !== document) {
                orphaned++;
            }

            listenerMap.forEach(listeners => {
                total += listeners.size;
            });
        });

        return { total, orphaned };
    }

    analyzeTimers() {
        let active = 0;
        let longRunning = 0;
        const now = Date.now();

        this.monitors.timers.forEach(timer => {
            active++;
            if ((now - timer.created) > 300000) {
                longRunning++;
            }
        });

        return { active, longRunning };
    }

    analyzeObservers() {
        let active = 0;
        const now = Date.now();

        this.monitors.observers.forEach(observer => {
            if ((now - observer.created) < 300000) {
                active++;
            }
        });

        return { active, total: this.monitors.observers.size };
    }

    analyzeDOMNodes() {
        return {
            tracked: this.monitors.domNodes ? this.monitors.domNodes.size || 0 : 0
        };
    }

    checkEventListenerThreshold() {
        let count = 0;
        this.monitors.eventListeners.forEach(listenerMap => {
            listenerMap.forEach(listeners => {
                count += listeners.size;
            });
        });

        if (count > this.thresholds.eventListenerCount) {
            console.warn(`🚨 Event listener threshold exceeded: ${count}`);
            this.cleanupEventListeners();
        }
    }

    checkTimerThreshold() {
        if (this.monitors.timers.size > this.thresholds.timerCount) {
            console.warn(`🚨 Timer threshold exceeded: ${this.monitors.timers.size}`);
            this.cleanupTimers();
        }
    }

    checkDOMNodeThreshold() {
        const nodeCount = this.monitors.domNodes ? this.monitors.domNodes.size || 0 : 0;
        if (nodeCount > this.thresholds.domNodeCount) {
            console.warn(`🚨 DOM node threshold exceeded: ${nodeCount}`);
            this.cleanupDOMReferences();
        }
    }

    scheduleGarbageCollection() {
        if (typeof window.gc === 'function') {
            setTimeout(() => {
                window.gc();
            }, 1000);
        } else {
            const blob = new Blob([''], { type: 'text/plain' });
            URL.createObjectURL(blob);
            setTimeout(() => {
                URL.revokeObjectURL(blob);
            }, 100);
        }
    }

    captureStack() {
        try {
            throw new Error();
        } catch (error) {
            return error.stack || 'Stack trace not available';
        }
    }

    gatherStackTraces() {
        const traces = [];

        this.monitors.eventListeners.forEach(listenerMap => {
            listenerMap.forEach(listeners => {
                listeners.forEach(item => {
                    if (item.stack) {
                        traces.push(item.stack);
                    }
                });
            });
        });

        return traces.slice(0, 5);
    }

    analyzeSuspiciousPatterns() {
        const patterns = [];

        if (this.monitors.timers.size > 20) {
            patterns.push('High timer count');
        }

        if (this.monitors.eventListeners.size > 100) {
            patterns.push('High event listener count');
        }

        const memoryGrowthRate = (this.memoryStats.current - this.memoryStats.initial) /
                                (Date.now() - performance.timeOrigin);

        if (memoryGrowthRate > 1000) {
            patterns.push('Rapid memory growth');
        }

        return patterns;
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    logMemoryStats(stats) {
        if (console.group && typeof console.group === 'function') {
            console.group('🛡️ Memory Usage Stats');
            console.log('Current:', stats.current);
            console.log('Peak:', stats.peak);
            console.log('Increase:', stats.increase);
            console.log('Utilization:', stats.utilizationPercent + '%');
            console.groupEnd();
        }
    }

    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            memory: {
                initial: this.formatBytes(this.memoryStats.initial),
                current: this.formatBytes(this.memoryStats.current),
                peak: this.formatBytes(this.memoryStats.peak),
                increase: this.formatBytes(this.memoryStats.current - this.memoryStats.initial)
            },
            tracking: {
                eventListeners: this.monitors.eventListeners.size,
                timers: this.monitors.timers.size,
                observers: this.monitors.observers.size,
                domNodes: this.monitors.domNodes ? this.monitors.domNodes.size || 0 : 0
            },
            leaks: this.memoryStats.leaks.length,
            warnings: this.memoryStats.warnings.length,
            recommendations: this.generateRecommendations()
        };

        console.log('📊 Memory Leak Prevention Report:', report);
        this.displayReport(report);
        return report;
    }

    generateRecommendations() {
        const recommendations = [];

        if (this.memoryStats.leaks.length > 0) {
            recommendations.push('Investigate detected memory leaks');
        }

        if (this.monitors.timers.size > 10) {
            recommendations.push('Review and clean up active timers');
        }

        if (this.monitors.eventListeners.size > 50) {
            recommendations.push('Audit event listener usage');
        }

        if (this.memoryStats.current - this.memoryStats.initial > 20 * 1024 * 1024) {
            recommendations.push('Monitor memory growth patterns');
        }

        return recommendations;
    }

    displayReport(report) {
        const style = `
            position: fixed; top: 20px; left: 20px; width: 400px; max-height: 80vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; border-radius: 15px; padding: 20px; font-family: 'Segoe UI', sans-serif;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3); z-index: 10001; overflow-y: auto;
            border: 1px solid rgba(255,255,255,0.2);
        `;

        const panel = document.createElement('div');
        panel.style.cssText = style;
        panel.innerHTML = `
            <h3 style="margin: 0 0 15px 0; color: #fff; font-size: 18px;">
                🛡️ Memory Leak Prevention Report
            </h3>
            <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                <h4 style="margin: 0 0 10px 0;">Memory Usage</h4>
                <div style="font-size: 12px;">
                    <div>Current: ${report.memory.current}</div>
                    <div>Peak: ${report.memory.peak}</div>
                    <div>Increase: ${report.memory.increase}</div>
                </div>
            </div>
            <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                <h4 style="margin: 0 0 10px 0;">Tracked Resources</h4>
                <div style="font-size: 12px;">
                    <div>Event Listeners: ${report.tracking.eventListeners}</div>
                    <div>Timers: ${report.tracking.timers}</div>
                    <div>Observers: ${report.tracking.observers}</div>
                    <div>DOM Nodes: ${report.tracking.domNodes}</div>
                </div>
            </div>
            <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                <h4 style="margin: 0 0 10px 0;">Issues</h4>
                <div style="font-size: 12px;">
                    <div>Detected Leaks: ${report.leaks}</div>
                    <div>Warnings: ${report.warnings}</div>
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
        }, 45000);
    }

    destroy() {
        this.isMonitoring = false;

        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
        }

        if (this.deepAnalysisInterval) {
            clearInterval(this.deepAnalysisInterval);
        }

        if (this.memoryObserver) {
            this.memoryObserver.disconnect();
        }

        this.performEmergencyCleanup();

        console.log('🛡️ Memory Leak Prevention System deactivated');
    }
}

if (typeof window !== 'undefined') {
    window.UltraMemoryLeakPreventer = UltraMemoryLeakPreventer;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.memoryLeakPreventer = new UltraMemoryLeakPreventer();
        });
    } else {
        window.memoryLeakPreventer = new UltraMemoryLeakPreventer();
    }
}
// 主JavaScript文件

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
    // 初始化动画效果
    initAnimations();

    // 初始化表单验证
    initFormValidation();

    // 初始化删除确认
    initDeleteConfirmation();

    // 初始化搜索功能
    initSearchFunctionality();

    // 初始化提示信息
    initNotifications();
});

// 初始化动画效果
function initAnimations() {
    // 为页面元素添加淡入动画
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in-up');
    });

    // 为按钮添加点击动画
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            // 创建波纹效果
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// 初始化表单验证
function initFormValidation() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            if (!validateForm(this)) {
                e.preventDefault();
                showNotification('请检查表单中的错误信息', 'danger');
            } else {
                showLoading();
            }
        });

        // 实时验证
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function () {
                validateField(this);
            });

            input.addEventListener('input', function () {
                clearFieldError(this);
            });
        });
    });
}

// 验证整个表单
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    return isValid;
}

// 验证单个字段
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;

    // 移除之前的错误样式
    clearFieldError(field);

    // 必填字段验证
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, '此字段为必填项');
        return false;
    }

    // 特定字段验证
    switch (fieldName) {
        case 'flight_number':
            if (value && !/^[A-Z]{2}\d{3,4}$/.test(value)) {
                showFieldError(field, '航班号格式应为：两个大写字母 + 3-4位数字（如：CA123）');
                return false;
            }
            break;

        case 'price':
        case 'total_seats':
        case 'discounted_tickets':
            if (value && (isNaN(value) || parseFloat(value) < 0)) {
                showFieldError(field, '请输入有效的正数');
                return false;
            }
            break;

        case 'departure_time':
        case 'arrival_time':
            if (value && !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
                showFieldError(field, '时间格式应为 HH:MM');
                return false;
            }
            break;

        case 'flight_date':
            if (value) {
                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                if (selectedDate < today) {
                    showFieldError(field, '航班日期不能早于今天');
                    return false;
                }
            }
            break;
    }

    return true;
}

// 显示字段错误
function showFieldError(field, message) {
    field.classList.add('is-invalid');

    // 移除之前的错误信息
    const existingError = field.parentNode.querySelector('.invalid-feedback');
    if (existingError) {
        existingError.remove();
    }

    // 添加新的错误信息
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

// 清除字段错误
function clearFieldError(field) {
    field.classList.remove('is-invalid');
    const errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// 初始化删除确认
function initDeleteConfirmation() {
    const deleteButtons = document.querySelectorAll('.btn-danger[href*="delete"]');

    deleteButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            const href = this.getAttribute('href');
            showConfirmDialog(
                '确认删除',
                '您确定要删除这个航班吗？此操作不可撤销。',
                function () {
                    window.location.href = href;
                }
            );
        });
    });
}

// 显示确认对话框
function showConfirmDialog(title, message, onConfirm) {
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${title}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-danger" id="confirmBtn">确认</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // 绑定确认按钮事件
    const confirmBtn = modal.querySelector('#confirmBtn');
    confirmBtn.addEventListener('click', function () {
        onConfirm();
        const bsModal = bootstrap.Modal.getInstance(modal);
        bsModal.hide();
    });

    // 显示模态框
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();

    // 模态框隐藏后移除DOM元素
    modal.addEventListener('hidden.bs.modal', function () {
        modal.remove();
    });
}

// 初始化搜索功能
function initSearchFunctionality() {
    const searchInputs = document.querySelectorAll('.search-input');

    searchInputs.forEach(input => {
        input.addEventListener('input', function () {
            const searchTerm = this.value.toLowerCase();
            const targetTable = document.querySelector('.flight-table tbody');

            if (targetTable) {
                const rows = targetTable.querySelectorAll('tr');

                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    if (text.includes(searchTerm)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            }
        });
    });
}

// 初始化通知系统
function initNotifications() {
    // 检查URL参数中的消息
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
    const type = urlParams.get('type') || 'info';

    if (message) {
        showNotification(decodeURIComponent(message), type);
    }
}

// 显示通知
function showNotification(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '300px';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(alertDiv);

    // 自动隐藏
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// 显示加载状态
function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-overlay position-fixed w-100 h-100 d-flex align-items-center justify-content-center';
    loadingDiv.style.top = '0';
    loadingDiv.style.left = '0';
    loadingDiv.style.background = 'rgba(0,0,0,0.5)';
    loadingDiv.style.zIndex = '9999';
    loadingDiv.innerHTML = `
        <div class="text-center text-white">
            <div class="spinner-border mb-3" role="status">
                <span class="visually-hidden">加载中...</span>
            </div>
            <div>正在处理中，请稍候...</div>
        </div>
    `;

    document.body.appendChild(loadingDiv);
}

// 隐藏加载状态
function hideLoading() {
    const loadingDiv = document.querySelector('.loading-overlay');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

// 实用工具函数
const Utils = {
    // 格式化日期
    formatDate: function (dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN');
    },

    // 格式化时间
    formatTime: function (timeString) {
        return timeString.substring(0, 5);
    },

    // 格式化价格
    formatPrice: function (price) {
        return '¥' + parseFloat(price).toFixed(2);
    },

    // 复制到剪贴板
    copyToClipboard: function (text) {
        navigator.clipboard.writeText(text).then(function () {
            showNotification('已复制到剪贴板', 'success');
        });
    }
};

// 暴露全局函数
window.showNotification = showNotification;
window.showConfirmDialog = showConfirmDialog;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.Utils = Utils; 
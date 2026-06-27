/* ========================================
   EMS国际邮件商业报关 - 网站交互脚本
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ===== 导航栏滚动效果 =====
  const nav = document.querySelector('.top-nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  // ===== 移动端菜单 =====
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
    // 点击链接后关闭菜单
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  // ===== FAQ折叠 =====
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const isOpen = item.classList.contains('open');
      // 关闭所有
      document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('open'));
      // 打开当前（如果不是已打开）
      if (!isOpen) item.classList.add('open');
    });
  });

  // ===== 查询工具 - 复制链接弹窗 =====
  document.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('click', () => {
      const url = card.dataset.url;
      if (!url) return;
      copyAndPrompt(url, card.querySelector('.tool-name').textContent);
    });
  });

  // ===== 一键拨号 =====
  document.querySelectorAll('[data-phone]').forEach(el => {
    el.addEventListener('click', () => {
      window.location.href = 'tel:' + el.dataset.phone;
    });
  });

  // ===== 留言表单 =====
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('[name="name"]').value.trim();
      const phone = form.querySelector('[name="phone"]').value.trim();
      if (!name) { alert('请输入您的姓名'); return; }
      if (!phone) { alert('请输入您的联系电话'); return; }
      // 弹窗引导用户主动联系
      if (confirm('留言信息已准备好。\n\n建议直接拨打 15026608761 获得最快响应。\n\n点击确定立即拨打，点击取消复制微信号。')) {
        window.location.href = 'tel:15026608761';
      } else {
        copyText('15026608761', '微信号已复制：15026608761（报关员小张）');
      }
      form.reset();
    });
  }

  // ===== 滚动渐入动画 =====
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-in').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

});

// ===== 工具函数 =====
function copyAndPrompt(url, name) {
  copyText(url, '链接已复制！\n\n请在手机浏览器中粘贴打开「' + name + '」\n\n' + url);
}

function copyText(text, message) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      alert(message);
    }).catch(() => {
      fallbackCopy(text, message);
    });
  } else {
    fallbackCopy(text, message);
  }
}

function fallbackCopy(text, message) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  try { document.execCommand('copy'); alert(message); }
  catch (err) { prompt('请手动复制以下链接：', text); }
  document.body.removeChild(textarea);
}

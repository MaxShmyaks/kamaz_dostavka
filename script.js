document.addEventListener('DOMContentLoaded', () => {
  const orderForm = document.getElementById('orderForm');
  const orderSection = document.getElementById('order');
  const orderFormCard = document.querySelector('.order-form__card');
  const serviceSelect = document.getElementById('service');
  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');

  const serviceMap = {
    'Доставка песка': 'sand',
    'Доставка щебня': 'gravel',
    'Вывоз строительного мусора': 'waste',
    'Доставка чернозёма': 'chernozem',
    'Доставка асфальтного среза': 'asphalt',
    'Доставка навоза': 'manure',
  };

  const SUCCESS_MESSAGE =
    'Спасибо! Мы свяжется с Вами в течение 1 часа для расчета стоимости';

  function extractDigits(value) {
    let digits = value.replace(/\D/g, '');

    if (digits.startsWith('8')) {
      digits = '7' + digits.slice(1);
    } else if (digits.length > 0 && !digits.startsWith('7')) {
      digits = '7' + digits;
    }

    return digits.slice(0, 11);
  }

  function formatPhone(digits) {
    if (!digits) return '';

    const parts = [
      digits.slice(1, 4),
      digits.slice(4, 7),
      digits.slice(7, 9),
      digits.slice(9, 11),
    ];

    let formatted = '+7';

    if (parts[0]) formatted += ` (${parts[0]}`;
    if (parts[0] && parts[0].length === 3) formatted += ')';
    if (parts[1]) formatted += ` ${parts[1]}`;
    if (parts[2]) formatted += `-${parts[2]}`;
    if (parts[3]) formatted += `-${parts[3]}`;

    return formatted;
  }

  function isValidPhone(value) {
    return extractDigits(value).length === 11;
  }

  function setFieldError(field, message) {
    const wrapper = field.closest('.order-form__field');
    const existing = wrapper.querySelector('.order-form__error');

    field.classList.add('order-form__input--error');

    if (existing) {
      existing.textContent = message;
      return;
    }

    const error = document.createElement('span');
    error.className = 'order-form__error';
    error.textContent = message;
    wrapper.appendChild(error);
  }

  function clearFieldError(field) {
    const wrapper = field.closest('.order-form__field');
    const existing = wrapper.querySelector('.order-form__error');

    field.classList.remove('order-form__input--error');
    if (existing) existing.remove();
  }

  function validateForm() {
    let isValid = true;

    clearFieldError(nameInput);
    clearFieldError(phoneInput);
    clearFieldError(serviceSelect);

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const service = serviceSelect.value;

    if (!name) {
      setFieldError(nameInput, 'Введите ваше имя');
      isValid = false;
    } else if (name.length < 2) {
      setFieldError(nameInput, 'Имя должно содержать минимум 2 символа');
      isValid = false;
    }

    if (!phone) {
      setFieldError(phoneInput, 'Введите номер телефона');
      isValid = false;
    } else if (!isValidPhone(phone)) {
      setFieldError(phoneInput, 'Введите номер полностью: +7 (XXX) XXX-XX-XX');
      isValid = false;
    }

    if (!service) {
      setFieldError(serviceSelect, 'Выберите услугу из списка');
      isValid = false;
    }

    return isValid;
  }

  function scrollToOrder(serviceValue = null) {
    if (serviceValue) {
      serviceSelect.value = serviceValue;
    }

    orderSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    setTimeout(() => {
      if (serviceValue) {
        nameInput.focus();
      } else {
        phoneInput.focus();
      }
    }, 600);
  }

  function showSuccessMessage() {
    orderFormCard.innerHTML = `
      <div class="order-form__success" role="status" aria-live="polite">
        <div class="order-form__success-icon" aria-hidden="true">✓</div>
        <p class="order-form__success-text">${SUCCESS_MESSAGE}</p>
      </div>
    `;
  }

  phoneInput.addEventListener('keydown', (e) => {
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End',
    ];

    if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey) return;
    if (!/^\d$/.test(e.key)) e.preventDefault();
  });

  phoneInput.addEventListener('input', () => {
    const digits = extractDigits(phoneInput.value);
    phoneInput.value = formatPhone(digits);
    clearFieldError(phoneInput);
  });

  phoneInput.addEventListener('paste', (e) => {
    e.preventDefault();
    const pasted = (e.clipboardData || window.clipboardData).getData('text');
    phoneInput.value = formatPhone(extractDigits(pasted));
    clearFieldError(phoneInput);
  });

  nameInput.addEventListener('input', () => clearFieldError(nameInput));
  serviceSelect.addEventListener('change', () => clearFieldError(serviceSelect));

  document.getElementById('callbackBtn').addEventListener('click', () => {
    scrollToOrder();
  });

  document.querySelectorAll('.js-scroll-to-order').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToOrder();
    });
  });

  document.querySelectorAll('.service-card__btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const title = btn
        .closest('.service-card')
        .querySelector('.service-card__title')
        .textContent.trim();
      scrollToOrder(serviceMap[title] || null);
    });
  });

  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    showSuccessMessage();
  });
});

import React, { useState } from 'react';

const ExpandingText: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  // Обработчик нажатия кнопки для изменения состояния
  const toggleExpanded = () => {
    setExpanded(prevExpanded => !prevExpanded);
  };

  // Объект со стилями
  const styles = {
    container: {
      maxWidth: '400px',
      margin: '0 auto',
      textAlign: 'center',
    },
    toggleButton: {
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      marginBottom: '20px',
      cursor: 'pointer',
    },
    textContainer: {
      maxHeight: expanded ? '500px' : '0', // Используем состояние expanded для изменения высоты контейнера
      overflow: 'hidden',
      transition: 'max-height 0.5s ease-out', // Анимация расширения текста
    },
  };

  return (
    <div style={styles.container}>
      <button style={styles.toggleButton} onClick={toggleExpanded}>
        {expanded ? 'Свернуть' : 'Развернуть'}
      </button>
      {/* Показываем текст только если expanded === true */}
      {expanded && (
        <div style={styles.textContainer}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </div>
      )}
    </div>
  );
};

export default ExpandingText;

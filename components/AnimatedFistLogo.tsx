import React from 'react';

interface AnimatedFistLogoProps {
  size: 'small' | 'large';
}

const AnimatedFistLogo: React.FC<AnimatedFistLogoProps> = ({ size }) => {
  const containerClasses = size === 'small' ? 'p-2 rounded-lg' : 'p-3 rounded-lg';
  const imageClasses = size === 'small' ? 'h-5 w-5' : 'h-6 w-6'; // Ajusta o tamanho do GIF

  return (
    <div className={`bg-[#D49929] flex items-center justify-center ${containerClasses}`}>
      {/* 
        Por favor, adicione seu GIF animado de punho cerrado na pasta 'public'
        e atualize o atributo 'src' abaixo com o caminho correto.
        Exemplo: src="/animated-fist.gif"
        Certifique-se de que o GIF tenha um fundo transparente para melhor integração.
        Se o GIF não for marrom, você pode precisar editá-lo ou adicionar estilos CSS aqui.
      */}
      <img 
        src="/animated-fist-placeholder.gif" // Caminho de placeholder - você precisará substituí-lo
        alt="Punho Cerrado Animado" 
        className={`${imageClasses} object-contain`} 
      />
    </div>
  );
};

export default AnimatedFistLogo;
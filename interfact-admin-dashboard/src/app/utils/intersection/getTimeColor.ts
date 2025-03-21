export const getTimeColor = (score: number): string => {
    if (score <= 1) return 'green';
    switch (score) {
      case 2: return '#FA9E9E';
      case 3: return '#F87777';
      case 4: return '#F76464';
      case 5: return '#F65151';
      case 6: return '#F53D3D';
      case 7: return '#F42A2A';
      case 8: return '#F31616';
      case 9: return '#E90C0C';
      case 10: return '#C20A0A';
      default: return 'green';
    }
  };
  
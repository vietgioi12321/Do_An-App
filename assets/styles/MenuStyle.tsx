export const getTabStyle = (tabName: string, activeTab:string) => {
    const isActive = activeTab === tabName;
    return {
      color: isActive ? '#4FB04F' : '#FFFFFF',
      fontFamily: 'Istok Web',
      fontSize: 16,
      fontWeight: isActive ? 'bold' as const : 'normal' as const,
      paddingBottom: 4,
      borderBottomWidth: isActive ? 3 : 0,
      borderBottomColor: '#4FB04F',
    };
  };
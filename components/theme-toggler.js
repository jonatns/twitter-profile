import { Text, StyleSheet } from 'react-native';
import Switch from 'react-switch';
import { ThemeContext } from './theme-context';

function ThemeToggler() {
  return (
    <ThemeContext.Consumer>
      {({ theme, toggleTheme, checked }) => (
        <Switch
          onChange={toggleTheme}
          checked={checked}
          offColor={theme.blue}
          onColor={theme.blue}
          height={31}
          width={60}
          handleDiameter={25}
          uncheckedIcon={
            <Text style={[styles.icon, { fontSize: 18, paddingTop: 2 }]}>
              ☀️
            </Text>
          }
          checkedIcon={
            <Text style={[styles.icon, { paddingLeft: 4, fontSize: 15 }]}>
              🌙
            </Text>
          }
        />
      )}
    </ThemeContext.Consumer>
  );
}

const styles = StyleSheet.create({
  icon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  }
});

export default ThemeToggler;

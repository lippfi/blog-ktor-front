import { ref } from 'vue';

// Global styles state
const styles = ref<string[]>([]);

// Function to update styles
export const updateStyles = (newStyles: string[]) => {
  console.log('Updating styles:', newStyles);
  styles.value = newStyles;
}

// Function to get styles
export const getStyles = () => styles;
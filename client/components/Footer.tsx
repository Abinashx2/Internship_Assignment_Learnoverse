import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FooterProps {
  onShare?: () => void;
  onLike?: () => void;
  onSave?: () => void;
}

const Footer: React.FC<FooterProps> = ({ 
  onShare = () => {}, 
  onLike = () => {}, 
  onSave = () => {} 
}) => {
  const currentYear = new Date().getFullYear();

  const handleContact = () => {
    Linking.openURL('mailto:support@learnoverse.com');
  };

  const handlePrivacy = () => {
    Linking.openURL('https://learnoverse.com/privacy');
  };

  const handleTerms = () => {
    Linking.openURL('https://learnoverse.com/terms');
  };

  return (
    <View style={styles.footer}>
      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={onLike}>
          <Ionicons name="heart-outline" size={24} color="#fff" />
          <Text style={styles.actionText}>Like</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onShare}>
          <Ionicons name="share-social-outline" size={24} color="#fff" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onSave}>
          <Ionicons name="bookmark-outline" size={24} color="#fff" />
          <Text style={styles.actionText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Links */}
      <View style={styles.links}>
        <TouchableOpacity onPress={handleContact}>
          <Text style={styles.linkText}>Contact</Text>
        </TouchableOpacity>
        <Text style={styles.separator}>•</Text>
        <TouchableOpacity onPress={handlePrivacy}>
          <Text style={styles.linkText}>Privacy</Text>
        </TouchableOpacity>
        <Text style={styles.separator}>•</Text>
        <TouchableOpacity onPress={handleTerms}>
          <Text style={styles.linkText}>Terms</Text>
        </TouchableOpacity>
      </View>

      {/* Copyright */}
      <Text style={styles.copyright}>
        © {currentYear} Learnoverse. All rights reserved.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#0f0f0f',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 30,
  },
  actionButton: {
    alignItems: 'center',
    padding: 10,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    gap: 15,
  },
  linkText: {
    color: '#aaa',
    fontSize: 14,
  },
  separator: {
    color: '#666',
    fontSize: 14,
  },
  copyright: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default Footer;
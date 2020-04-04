import jamonIpsum, { countWordsInTokens, joinTokens } from './generator';

describe('Jamon Ipsum', () => {
  describe('#joinTokens', () => {
    it('should join tokens with whitespaces', () => {
      expect(joinTokens(['kinki', 'la', 'bocadillo', 'pipas', 'careto', 'mus']))
        .toBe('kinki la bocadillo pipas careto mus');
    });
  });

  describe('#countWordsInTokens', () => {
    it('should count correctly regular tokens', () => {
      expect(countWordsInTokens(['kinki', 'la', 'bocadillo', 'pipas', 'careto', 'mus'])).toBe(6);
    });
    it('should count correctly when tokens contain spaces', () => {
      expect(countWordsInTokens(['lágrima', 'en la arena'])).toBe(4);
    });
  });

  describe('generator', () => {
    expect.extend({
      toHaveWordCount(received, expectedCount) {
        const count = received.split(/\s/).filter((s) => s !== '').length;
        return {
          pass: count === expectedCount,
          message: () => `expected '${received}' to have ${expectedCount} words, but had ${count}.`,
        };
      },
      toHaveParagraphCount(received, expectedCount) {
        const count = received.split(/\n/).filter((s) => s !== '').length;
        return {
          pass: count === expectedCount,
          message: () => `expected '${received}' to have ${expectedCount} paragraphs, but had ${count}.`,
        };
      },
    });

    it('should return a text with the specified amount of words', (done) => {
      jamonIpsum({
        type: 'words',
        count: 10,
        useEmojis: false,
      }).then((text) => {
        expect(text).toHaveWordCount(10);
        done();
      });
    });

    it('should return a text with the specified amount of paragraphs', (done) => {
      jamonIpsum({
        type: 'paragraphs',
        count: 3,
        useEmojis: false,
      }).then((text) => {
        expect(text).toHaveParagraphCount(3);
        done();
      });
    });
  });
});

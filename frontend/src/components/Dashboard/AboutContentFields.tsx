import { useMemo } from 'react';
import {
  Box,
  Text,
  FormControl,
  FormHelperText,
  Textarea,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import DOMPurify from 'dompurify';

interface AboutContentFieldsProps {
  value: string;
  onChange: (value: string) => void;
  brandColor?: string;
  businessName?: string;
}

const ALLOWED_TAGS = ['h2', 'h3', 'h4', 'p', 'br', 'strong', 'b', 'em', 'i', 'ul', 'ol', 'li', 'blockquote', 'a'];
const ALLOWED_ATTR = ['href', 'target', 'rel'];

export function AboutContentFields({
  value,
  onChange,
  brandColor,
  businessName,
}: AboutContentFieldsProps) {
  const sanitizedHtml = useMemo(() => {
    if (!value) return '';
    return DOMPurify.sanitize(value, { ALLOWED_TAGS, ALLOWED_ATTR });
  }, [value]);

  const accentColor = brandColor || 'brand.500';
  const linkColor = brandColor || 'brand.600';

  return (
    <Tabs variant="enclosed" size="sm">
      <TabList>
        <Tab>Edit</Tab>
        <Tab>Preview</Tab>
      </TabList>
      <TabPanels>
        <TabPanel px={0}>
          <FormControl>
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={`<h2>Welcome to ${businessName || 'Your Business'}</h2>

<p>Write your story here...</p>

<h3>What We Offer</h3>
<ul>
  <li>Service 1</li>
  <li>Service 2</li>
</ul>

<blockquote>
  "Customer testimonial here"
</blockquote>`}
              rows={12}
              fontFamily="mono"
              fontSize="sm"
            />
            <FormHelperText>
              Supports HTML: &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;,
              &lt;li&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;blockquote&gt;,
              &lt;a&gt;
            </FormHelperText>
          </FormControl>
        </TabPanel>
        <TabPanel px={0}>
          <Box
            p={4}
            border="1px"
            borderColor="border.subtle"
            borderRadius="lg"
            minH="200px"
            sx={{
              '& h2': { fontSize: 'xl', fontWeight: '700', color: 'text.heading', mb: 3, mt: 4, _first: { mt: 0 } },
              '& h3': { fontSize: 'lg', fontWeight: '600', color: 'text.primary', mb: 2, mt: 4 },
              '& h4': { fontSize: 'md', fontWeight: '600', color: 'text.strong', mb: 2, mt: 3 },
              '& p': { fontSize: 'md', color: 'text.secondary', lineHeight: '1.7', mb: 3, _last: { mb: 0 } },
              '& ul, & ol': { pl: 5, mb: 3, color: 'text.secondary' },
              '& li': { mb: 1, lineHeight: '1.6' },
              '& blockquote': {
                borderLeftWidth: '3px',
                borderLeftColor: accentColor,
                pl: 4, py: 2, my: 4,
                bg: 'surface.alt',
                borderRadius: 'md',
                fontStyle: 'italic',
                color: 'text.secondary',
              },
              '& a': { color: linkColor, textDecoration: 'underline' },
              '& strong, & b': { fontWeight: '600', color: 'text.primary' },
              '& em, & i': { fontStyle: 'italic' },
            }}
          >
            {sanitizedHtml ? (
              <Box dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
            ) : (
              <Text color="text.faint" fontStyle="italic">
                Enter content in the Edit tab to see a preview...
              </Text>
            )}
          </Box>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

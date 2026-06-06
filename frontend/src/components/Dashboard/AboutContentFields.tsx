import {
  Box,
  FormControl,
  FormHelperText,
  Textarea,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Button,
} from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import type { WebsiteFormValues } from '../../pages/dashboard/websiteForm.types';

function buildAboutContentTemplate(businessName?: string): string {
  const display = businessName?.trim() || 'Your Business';
  return `<h2>Welcome to ${display}</h2>

<p>Write your story here...</p>

<h3>What We Offer</h3>
<ul>
  <li>Service 1</li>
  <li>Service 2</li>
</ul>

<blockquote>
  "Customer testimonial here"
</blockquote>`;
}

const helperTextProps = {
  fontSize: 'xs',
  color: 'text.muted',
};

export function AboutContentEditor() {
  const { watch, setValue } = useFormContext<WebsiteFormValues>();
  const value = watch('about.aboutContent');
  const onChange = (v: string) => setValue('about.aboutContent', v, { shouldDirty: true });

  return (
    <>
      <Box display={{ base: 'block', md: 'none' }}>
        <AboutEditorFields value={value} onChange={onChange} />
      </Box>
      <Box display={{ base: 'none', md: 'block' }}>
        <AboutEditorFields value={value} onChange={onChange} />
      </Box>
    </>
  );
}

function AboutEditorFields({
  value,
  onChange,
  businessName,
}: {
  value: string;
  onChange: (v: string) => void;
  businessName?: string;
}) {
  const placeholder = buildAboutContentTemplate(businessName);
  const isEmpty = !value.trim();

  return (
    <FormControl>
      {isEmpty && (
        <Button
          variant="ghost"
          size="sm"
          mb="space.stack.sm"
          onClick={() => onChange(placeholder)}
        >
          Insert template
        </Button>
      )}
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={16}
        minH={96}
        size="md"
        fontFamily="mono"
        fontSize="sm"
      />
      <FormHelperText {...helperTextProps}>
        Supports HTML: &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;,
        &lt;em&gt;, &lt;blockquote&gt;, &lt;a&gt;
      </FormHelperText>
    </FormControl>
  );
}

export function AboutContentFields() {
  const { watch, setValue } = useFormContext<WebsiteFormValues>();
  const value = watch('about.aboutContent');
  // const brandColor = watch('branding.brandColor');
  // const businessName = watch('profile.name');

  // const accentColor = brandColor || 'brand.500';
  // const linkColor = brandColor || 'brand.600';
  const onChange = (v: string) => setValue('about.aboutContent', v, { shouldDirty: true });

  return (
    <>
      <Box display={{ base: 'block', md: 'none' }}>
        <Tabs variant="enclosed" size="sm" colorScheme="brand">
          <TabList>
            <Tab>Edit</Tab>
            <Tab>Preview</Tab>
          </TabList>
          <TabPanels>
            <TabPanel px={0}>
              <AboutEditorFields
                value={value}
                onChange={onChange}
                // businessName={businessName}
              />
            </TabPanel>
            <TabPanel px={0}>
              {/* <AboutPreviewBox
                sanitizedHtml={sanitizedHtml}
                accentColor={accentColor}
                linkColor={linkColor}
              /> */}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      <SimpleGrid
        display={{ base: 'none', md: 'grid' }}
        columns={2}
        spacing="space.stack.md"
        alignItems="start"
      >
        {/* <AboutEditorFields value={value} onChange={onChange} businessName={businessName} /> */}
        {/* <AboutPreviewBox
          sanitizedHtml={sanitizedHtml}
          accentColor={accentColor}
          linkColor={linkColor}
        /> */}
      </SimpleGrid>
    </>
  );
}

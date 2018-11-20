//Mostly template code. The settings aren't complicated for this individual app,
//So there's just a title and a colour select
function colourSettings(props) {
  return (
    <Page>
      <Section title="Colour Theme">
        <ColorSelect
          settingsKey="colour"
          colors={[
            {color: '#e8004e', value: '#e8004e'},
            {color: '#00b6e8', value: '#00b6e8'},
            {color: '#d300e8', value: '#d300e8'},
            {color: '#91d805', value: '#91d805'},
            {color: '#7d94a8', value: '#7d94a8'},
            {color: '#eb9d0c', value: '#eb9d0c'}
          ]}
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(colourSettings);
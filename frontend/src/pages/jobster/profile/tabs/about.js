import {Paper, Divider, Box, Stack, Typography} from '@mui/material'
import PropTypes from 'prop-types'
// theme
import color from 'src/theme/palette'

About.propTypes = {
  form: PropTypes.object
}

export default function About({form}) {
  return (
    <Box>
      <Stack spacing={3}>
        <Typography variant="h4" sx={{borderLeft: `4px solid ${color.starjobs.main}`, pl: 2, mb: 2}}>
          About
        </Typography>
      </Stack>
      <Paper sx={{py: 3, mb: 5, px: 2}}>
        <Box>
          <Typography variant="body1" sx={{fontWeight: 'bold'}}>
            Expertise
          </Typography>
          <Box>
            <Stack direction={{xs: 'column', sm: 'column'}} spacing={2} sx={{mt: 2}}>
              <Typography variant="body2">Skills Qualification</Typography>
              <Typography variant="body2" sx={{marginTop: '0 !important', fontWeight: 'bold'}}>
                {form.expertise &&
                  form.expertise.skillQualification &&
                  form.expertise.skillQualification.split('=>').map((im, ix) => {
                    return (
                      <Typography
                        key={ix}
                        variant="body2"
                        sx={{mb: 0, marginTop: '0 !important', fontWeight: 'bold'}}
                        component="span"
                      >
                        - {im}
                      </Typography>
                    )
                  })}
              </Typography>
            </Stack>

            <Stack direction={{xs: 'column', sm: 'column'}} spacing={2} sx={{mt: 2}}>
              <Typography variant="body2">Skills offer</Typography>
              <Typography variant="body2" sx={{marginTop: '0 !important', fontWeight: 'bold'}}>
                {form.expertise &&
                  form.expertise.skillOffer &&
                  form.expertise.skillOffer.split('=>').map((im, ix) => {
                    return (
                      <Typography
                        key={ix}
                        variant="body2"
                        sx={{mb: 0, marginTop: '0 !important', fontWeight: 'bold'}}
                        component="span"
                      >
                        - {im}
                      </Typography>
                    )
                  })}
              </Typography>
            </Stack>

            <Typography variant="body2" sx={{mt: 2}}>
              Skill/s offer
            </Typography>
            <Stack direction={{xs: 'column', sm: 'column'}} spacing={2}>
              {form.expertise && form.expertise.workType.split('=>').length > 0 ? (
                form.expertise.workType.split('//').map((v) => {
                  return v
                    .replace(',', '')
                    .split('||')
                    .slice(1)
                    .map((itm) => {
                      return itm.split('=>').map((im, ix) => {
                        return (
                          <Typography
                            key={ix}
                            variant="body2"
                            sx={{mb: 0, marginTop: '0 !important', fontWeight: 'bold'}}
                          >
                            - {im}
                          </Typography>
                        )
                      })
                    })
                })
              ) : (
                <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                  {form.expertise && form.expertise.skillOfferOthers}
                </Typography>
              )}

              <Stack direction={{xs: 'row', sm: 'row'}} spacing={2}>
                <Typography variant="body2">Other Skills Expertise:</Typography>
                <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                  {form.expertise && form.expertise.othersExpertise}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Box>
        <Divider sx={{my: 2}} />
        <Box>
          <Typography variant="body1" sx={{fontWeight: 'bold'}}>
            Work Experience
          </Typography>
          <Box sx={{mt: 2}}>
            <Typography variant="body2" sx={{mb: 1}}>
              Current Employment
            </Typography>
            <Stack direction={{xs: 'row', sm: 'row'}} spacing={2}>
              <Typography variant="body2">Company Name:</Typography>
              <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                {form.work && form.work?.currentCompany}
              </Typography>
            </Stack>
            <Stack direction={{xs: 'row', sm: 'row'}} spacing={2}>
              <Typography variant="body2">Position:</Typography>
              <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                {form.work && form.work?.currentPosition}
              </Typography>
            </Stack>
            <Stack direction={{xs: 'row', sm: 'row'}} spacing={2}>
              <Typography variant="body2">Start Date:</Typography>
              <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                {form?.work && form.work?.currentStartDate}
              </Typography>
            </Stack>

            {form.work && form.work.isCurrentWork && (
              <Stack direction={{xs: 'row', sm: 'row'}} spacing={2}>
                <Typography variant="body2">End Date:</Typography>
                <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                  {form.work && form.work?.currentEndDate}
                </Typography>
              </Stack>
            )}

            <Stack direction={{xs: 'row', sm: 'row'}} spacing={2}>
              <Typography variant="body2">Place of Work:</Typography>
              <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                {form.work && form.work?.currentPlaceOfWork}
              </Typography>
            </Stack>
          </Box>
          {form.work && !form.work.isFreshGraduate ? (
            <Box sx={{mt: 2}}>
              <Typography variant="body2" sx={{mb: 1}}>
                Past Employment
              </Typography>
              <Stack direction={{xs: 'row', sm: 'row'}} sx={{my: 1}} spacing={2}>
                <Typography variant="body2">Company Name:</Typography>
                <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                  {form.work && form.work.pastCompany}
                </Typography>
              </Stack>

              <Stack direction={{xs: 'row', sm: 'row'}} sx={{my: 1}} spacing={2}>
                <Typography variant="body2">Position:</Typography>
                <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                  {form.work && form.work.pastPosition}
                </Typography>
              </Stack>

              <Stack direction={{xs: 'row', sm: 'row'}} sx={{my: 1}} spacing={2}>
                <Typography variant="body2">Start Date:</Typography>
                <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                  {form.work && form.work.pastStartDate}
                </Typography>
              </Stack>

              <Stack direction={{xs: 'row', sm: 'row'}} sx={{my: 1}} spacing={2}>
                <Typography variant="body2">End Date:</Typography>
                <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                  {form.work && form.work.pastEndDate}
                </Typography>
              </Stack>

              <Stack direction={{xs: 'row', sm: 'row'}} sx={{my: 1}} spacing={2}>
                <Typography variant="body2">Place of Work:</Typography>
                <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                  {form.work && form.work.pastPlaceOfWork}
                </Typography>
              </Stack>
            </Box>
          ) : (
            ''
          )}
        </Box>
        <Divider sx={{my: 2}} />
        <Box>
          <Typography variant="body1" sx={{fontWeight: 'bold'}}>
            Education Background
          </Typography>
          <Box sx={{mt: 2}}>
            <Typography variant="body2">High School</Typography>
            <Stack direction={{xs: 'row', sm: 'row'}} spacing={2}>
              <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                {form.education && form.education.highSchoolName}
              </Typography>
              <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                {form.education && form.education.highSchoolName}
              </Typography>
            </Stack>
          </Box>
          <Box sx={{mt: 2}}>
            <Typography variant="body2">College</Typography>
            <Stack direction={{xs: 'row', sm: 'row'}} spacing={2}>
              <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                {form.education && form.education.collegeName}
              </Typography>
              <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                {form.education && form.education.collegeYear}
              </Typography>
            </Stack>
          </Box>
          {(form.education && form.education?.vocationalProgram) || form.education?.vocationalProgram !== 'N/A' ? (
            <Box sx={{mt: 2}}>
              <Typography variant="body2">Vocational Program</Typography>
              <Stack direction={{xs: 'row', sm: 'row'}} spacing={2}>
                <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                  {form.education && form.education?.vocationalProgram}
                </Typography>
              </Stack>
            </Box>
          ) : (
            ''
          )}
        </Box>
      </Paper>
    </Box>
  )
}

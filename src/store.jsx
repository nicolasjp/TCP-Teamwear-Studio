import { proxy } from 'valtio'

const state = proxy({
  intro: true,
  colors: ['#ccc', '#EFBD4E', '#80C670', '#726DE8', '#EF674E', '#353934', '#4C4CFF', '#1FA055', '#FD6C9E', '#01796F', '#B22222', '#94718E', '#6495ED'],
  decals: ['logoV1', 'logoV2', 'logoV3', 'logoV4', 'logoV5'],
  color: '#01796F',
  decal: 'logoV1',
  hoodie: true,
})

export { state }

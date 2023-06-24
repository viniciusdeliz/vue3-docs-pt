import AxisLabel from './AxisLabel.vue'
import { valueToPoint } from './util.js'

export default {
  components: {
    AxisLabel
  },
  props: {
    stats: Array
  },
  computed: {
    // uma propriedade computada para os pontos do polígono
    points() {
      const total = this.stats.length
      return this.stats
        .map((stat, i) => {
          const { x, y } = valueToPoint(stat.value, i, total)
          return `${x},${y}`
        })
        .join(' ')
    }
  }
}

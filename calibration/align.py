#!/usr/bin/env python

import argparse
import numpy as np
import transformations
import json

if (__name__ == '__main__'):
	parser = argparse.ArgumentParser(description='Align measured qube virtual qube')
	parser.add_argument('--samples', nargs='+', help='One or more json files containing cube data.', required=True)
	parser.add_argument('--target', help='JSON File containing the virtual qubes location', required=True)
	parser.add_argument('--output', help='Location to write alignment matrix to', required=True)

	args = parser.parse_args()

	averageSample = None
	for sample in args.samples:
		with open(sample) as jsonFile:
			jsonData = json.load(jsonFile)
			print jsonData
			box = jsonData['box']
			if averageSample is not None:
				np.add(averageSample , np.array(box))
			else:
				averageSample = np.array(box);
		averageSample
		print(args);

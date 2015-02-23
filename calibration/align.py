#!/usr/bin/env python

import argparse
import transformations

parser = argparse.ArgumentParser(description='Align measured qube virtual qube')
parser.add_argument('--samples', nargs='+', help='One or more json files containing cube data.', required=True)
parser.add_argument('--target', help='JSON File containing the virtual qubes location', required=True)
parser.add_argument('--output', help='Location to write alignment matrix to', required=True)

args = parser.parse_args()
print(args);
